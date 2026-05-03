import { ref, computed } from 'vue'
import { 
  parseSaveFile, serializeSaveFile, getPeriodText,
  parseConfigFile, serializeConfigFile
} from '../utils/saveParser.js'
import { saveDirHandle, loadDirHandle, verifyPermission, clearDir } from '../utils/dirStore.js'

const hasFSA = typeof window.showOpenFilePicker === 'function'

const SAVE_PATTERN = /^v10_userdata(\d+)\.dat$/i
const CONFIG_PATTERN = /^v10_configdata\.dat$/i

export function useSaveData() {
  const saveData = ref(null)
  const isLoading = ref(false)
  const fileName = ref('')
  const error = ref(null)

  const dirReady = ref(false)
  const dirName = ref('')
  const saveSlots = ref([])

  const configData = ref(null)
  const configLoadState = ref('idle')
  const configLoadMessage = ref('')
  const configFileName = ref('')

  let dirHandle = null
  let configFileHandle = null

  const clearSaveSelection = () => {
    saveData.value = null
    fileName.value = ''
  }

  const clearDirectoryDataState = () => {
    clearSaveSelection()
    configData.value = null
    configLoadState.value = 'idle'
    configLoadMessage.value = ''
    configFileName.value = ''
    error.value = null
  }

  async function restoreDir() {
    if (!hasFSA) return
    try {
      const handle = await loadDirHandle()
      if (!handle) return
      const ok = await verifyPermission(handle)
      if (!ok) return
      dirHandle = handle
      dirName.value = handle.name
      dirReady.value = true
      clearDirectoryDataState()
      await refreshSlots()
      if (configFileHandle && configLoadState.value !== 'ready') {
        await loadConfigData()
      }
    } catch {}
  }

  async function pickDir() {
    if (!hasFSA) return false
    try {
      const handle = await window.showDirectoryPicker({
        mode: 'readwrite',
        startIn: dirHandle || 'desktop'
      })
      // 验证权限
      if ((await handle.queryPermission({ mode: 'readwrite' })) !== 'granted') {
        const perm = await handle.requestPermission({ mode: 'readwrite' })
        if (perm !== 'granted') {
          error.value = '需要目录读写权限'
          return false
        }
      }
      dirHandle = handle
      dirName.value = handle.name
      dirReady.value = true
      clearDirectoryDataState()
      await saveDirHandle(handle)
      await refreshSlots()
      if (configFileHandle && configLoadState.value !== 'ready') {
        await loadConfigData()
      }
      return true
    } catch (e) {
      if (e.name !== 'AbortError') {
        console.error('pickDir error:', e)
        error.value = '选择目录失败：' + e.message
      }
      return false
    }
  }

  async function refreshSlots() {
    if (!dirHandle) {
      saveSlots.value = []
      return
    }
    const slots = []
    configFileHandle = null
    configFileName.value = ''
    try {
      for await (const [name, fh] of dirHandle) {
        // 存档文件
        const m = name.match(SAVE_PATTERN)
        if (m && fh.kind === 'file') {
          try {
            const file = await fh.getFile()
            slots.push({
              slotId: parseInt(m[1]),
              name,
              size: file.size,
              lastModified: file.lastModified,
              handle: fh
            })
          } catch (e) {
            console.error('读取存档文件失败：', name, e)
          }
        }
        // 配置文件
        if (CONFIG_PATTERN.test(name) && fh.kind === 'file') {
          configFileHandle = fh
          configFileName.value = name
        }
      }
      slots.sort((a, b) => a.slotId - b.slotId)

      if (!configFileHandle) {
        try {
          configFileHandle = await dirHandle.getFileHandle('v10_configdata.dat')
          configFileName.value = 'v10_configdata.dat'
        } catch {}
      }

    } catch (e) {
      console.error('刷新目录失败：', e)
    }
    if (!configFileHandle) {
      configData.value = null
      configLoadState.value = 'missing'
      configLoadMessage.value = '当前目录未找到游戏设置文件 v10_configdata.dat'
    } else if (configLoadState.value !== 'ready') {
      configLoadState.value = 'idle'
      configLoadMessage.value = ''
    }
    saveSlots.value = slots
  }

  async function loadSlot(slot) {
    isLoading.value = true
    error.value = null
    try {
      const file = await slot.handle.getFile()
      const content = await file.text()
      saveData.value = parseSaveFile(content)
      fileName.value = slot.name
    } catch (e) {
      clearSaveSelection()
      error.value = '存档加载失败：' + e.message
      console.error('loadSlot error:', e)
    } finally {
      isLoading.value = false
    }
  }

  async function loadConfigData() {
    if (!configFileHandle) {
      await refreshSlots()
      if (!configFileHandle) {
        configData.value = null
        configLoadState.value = 'missing'
        configLoadMessage.value = '当前目录未找到游戏设置文件 v10_configdata.dat'
        return false
      }
    }
    isLoading.value = true
    configLoadState.value = 'loading'
    configLoadMessage.value = ''
    try {
      const file = await configFileHandle.getFile()
      const content = await file.text()
      configData.value = parseConfigFile(content)
      configLoadState.value = 'ready'
      configLoadMessage.value = ''
      return true
    } catch (e) {
      error.value = '设置加载失败：' + e.message
      configData.value = null
      configLoadState.value = 'error'
      configLoadMessage.value = error.value
      console.error('loadConfigData error:', e)
      return false
    } finally {
      isLoading.value = false
    }
  }

  const exportSave = () => {
    if (!saveData.value) { error.value = '没有可导出的数据'; return null }
    try {
      const encrypted = serializeSaveFile(saveData.value)
      const slotId = saveData.value.saveSlotId || 1
      const name = `v10_userdata${slotId}.dat`
      return { content: encrypted, fileName: name }
    } catch (e) {
      error.value = '导出失败：' + e.message
      console.error('Export error:', e)
      return null
    }
  }

  async function writeToFile(slot, content) {
    if (!dirHandle) return false
    try {
      const fh = await dirHandle.getFileHandle(slot.name, { create: true })
      const writable = await fh.createWritable()
      await writable.write(content)
      await writable.close()
      await refreshSlots()
      return true
    } catch (e) {
      console.error('writeToFile error:', e)
      return false
    }
  }

  const downloadSave = async () => {
    const result = exportSave()
    if (!result) return false

    if (dirHandle) {
      try {
        const ok = await writeToFile({ name: result.fileName }, result.content)
        if (ok) return true
      } catch (e) {
        error.value = '写入文件失败：' + e.message
        console.error('writeToFile failed:', e)
        return false
      }
    }

    try {
      const blob = new Blob([result.content], { type: 'text/plain' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = result.fileName
      a.click()
      URL.revokeObjectURL(url)
      return true
    } catch (e) {
      error.value = '导出失败：' + e.message
      console.error('Download failed:', e)
      return false
    }
  }

  const downloadConfig = async () => {
    if (!configData.value) return false
    try {
      const content = serializeConfigFile(configData.value)
      if (dirHandle && configFileHandle) {
        await writeToFile({ name: configFileName.value || 'v10_configdata.dat' }, content)
        return true
      }
      const blob = new Blob([content], { type: 'text/plain' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = 'v10_configdata.dat'
      a.click()
      URL.revokeObjectURL(url)
      return true
    } catch (e) {
      error.value = '设置保存失败：' + e.message
      console.error('downloadConfig error:', e)
      return false
    }
  }

  const getMonthText = (period) => getPeriodText(period)

  const hasData = computed(() => saveData.value !== null && saveData.value.status !== undefined)

  const clearData = () => {
    clearSaveSelection()
    error.value = null
  }

  const resetDir = async () => {
    await clearDir()
    dirHandle = null
    configFileHandle = null
    dirReady.value = false
    dirName.value = ''
    saveSlots.value = []
    clearDirectoryDataState()
    error.value = null
  }

  restoreDir()

  return {
    saveData, isLoading, fileName, error,
    dirReady, dirName, saveSlots,
    configData,
    configLoadState,
    configLoadMessage,
    pickDir, loadSlot, refreshSlots,
    loadConfigData,
    exportSave, downloadSave, downloadConfig,
    getMonthText, hasData, clearData, resetDir
  }
}
