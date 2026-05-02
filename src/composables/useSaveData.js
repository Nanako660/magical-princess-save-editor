import { ref, computed } from 'vue'
import { 
  parseSaveFile, serializeSaveFile, getPeriodText,
  parseIndexFile, serializeIndexFile,
  parseConfigFile, serializeConfigFile,
  parseDeviceFile, serializeDeviceFile,
  buildIndexParamsFromSaveData
} from '../utils/saveParser.js'
import { saveDirHandle, loadDirHandle, verifyPermission, clearDir } from '../utils/dirStore.js'

const hasFSA = typeof window.showOpenFilePicker === 'function'

const SAVE_PATTERN = /^v10_userdata(\d+)\.dat$/
const INDEX_PATTERN = /^v10_indexdata\.dat$/
const CONFIG_PATTERN = /^v10_configdata\.dat$/
const DEVICE_PATTERN = /^v10_devicedata\.cfg$/

export function useSaveData() {
  const saveData = ref(null)
  const isLoading = ref(false)
  const fileName = ref('')
  const error = ref(null)

  const dirReady = ref(false)
  const dirName = ref('')
  const saveSlots = ref([])

  // 新增：索引、配置、设备数据
  const indexData = ref(null)
  const configData = ref(null)
  const deviceData = ref(null)
  const indexFileName = ref('')
  const configFileName = ref('')
  const deviceFileName = ref('')

  let dirHandle = null
  let indexFileHandle = null
  let configFileHandle = null
  let deviceFileHandle = null

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
      await refreshSlots()
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
      await saveDirHandle(handle)
      await refreshSlots()
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
      console.log('refreshSlots: no dirHandle')
      saveSlots.value = []
      return
    }
    console.log('refreshSlots: scanning', dirHandle.name)
    const slots = []
    indexFileHandle = null
    configFileHandle = null
    deviceFileHandle = null
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
            console.warn('refreshSlots: skip file', name, e)
          }
        }
        // 索引文件
        if (INDEX_PATTERN.test(name) && fh.kind === 'file') {
          indexFileHandle = fh
          indexFileName.value = name
        }
        // 配置文件
        if (CONFIG_PATTERN.test(name) && fh.kind === 'file') {
          configFileHandle = fh
          configFileName.value = name
        }
        // 设备文件
        if (DEVICE_PATTERN.test(name) && fh.kind === 'file') {
          deviceFileHandle = fh
          deviceFileName.value = name
        }
      }
      slots.sort((a, b) => a.slotId - b.slotId)
      console.log('refreshSlots: found', slots.length, 'saves, index:', !!indexFileHandle, 'config:', !!configFileHandle, 'device:', !!deviceFileHandle)
    } catch (e) {
      console.error('refreshSlots error:', e)
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
      error.value = '存档加载失败：' + e.message
      console.error('loadSlot error:', e)
    } finally {
      isLoading.value = false
    }
  }

  // 加载存档索引
  async function loadIndexData() {
    if (!indexFileHandle) {
      console.log('loadIndexData: no index file')
      return false
    }
    isLoading.value = true
    try {
      const file = await indexFileHandle.getFile()
      const content = await file.text()
      indexData.value = parseIndexFile(content)
      console.log('loadIndexData: loaded', indexData.value?.dataList?.length, 'slots')
      return true
    } catch (e) {
      error.value = '索引加载失败：' + e.message
      console.error('loadIndexData error:', e)
      return false
    } finally {
      isLoading.value = false
    }
  }

  // 加载用户设置
  async function loadConfigData() {
    if (!configFileHandle) {
      console.log('loadConfigData: no config file')
      return false
    }
    isLoading.value = true
    try {
      const file = await configFileHandle.getFile()
      const content = await file.text()
      configData.value = parseConfigFile(content)
      console.log('loadConfigData: loaded')
      return true
    } catch (e) {
      error.value = '设置加载失败：' + e.message
      console.error('loadConfigData error:', e)
      return false
    } finally {
      isLoading.value = false
    }
  }

  // 加载设备设置
  async function loadDeviceData() {
    if (!deviceFileHandle) {
      console.log('loadDeviceData: no device file')
      return false
    }
    isLoading.value = true
    try {
      const file = await deviceFileHandle.getFile()
      const content = await file.text()
      deviceData.value = parseDeviceFile(content)
      console.log('loadDeviceData: loaded')
      return true
    } catch (e) {
      error.value = '设备设置加载失败：' + e.message
      console.error('loadDeviceData error:', e)
      return false
    } finally {
      isLoading.value = false
    }
  }

  const importSave = async (file) => {
    if (!file) return
    isLoading.value = true
    error.value = null
    try {
      const content = await file.text()
      saveData.value = parseSaveFile(content)
      fileName.value = file.name
    } catch (e) {
      error.value = '存档加载失败：' + e.message
      console.error('Import error:', e)
    } finally {
      isLoading.value = false
    }
  }

  const pickAndImportSave = async () => {
    if (!hasFSA) return null
    isLoading.value = true
    error.value = null
    try {
      const opts = {
        types: [{ description: '存档文件', accept: { 'application/octet-stream': ['.dat'] } }],
        multiple: false
      }
      if (dirHandle) opts.startIn = dirHandle

      const [handle] = await window.showOpenFilePicker(opts)
      const file = await handle.getFile()
      const content = await file.text()
      saveData.value = parseSaveFile(content)
      fileName.value = file.name

      try {
        dirHandle = await handle.getParent()
        dirName.value = dirHandle.name
        dirReady.value = true
        await saveDirHandle(dirHandle)
        await refreshSlots()
      } catch {}

      return handle
    } catch (e) {
      if (e.name !== 'AbortError') {
        error.value = '存档加载失败：' + e.message
        console.error('Import error:', e)
      }
      return null
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
        // 保存存档文件
        const ok = await writeToFile({ name: result.fileName }, result.content)
        if (ok) {
          // 同步更新索引文件
          if (indexData.value && saveData.value) {
            const slotId = saveData.value.saveSlotId || 1
            const newParams = buildIndexParamsFromSaveData(saveData.value, slotId)
            
            // 更新对应槽位的索引数据
            if (!indexData.value.dataList) indexData.value.dataList = []
            const existingIdx = indexData.value.dataList.findIndex(p => p.saveSlotId === slotId)
            if (existingIdx >= 0) {
              indexData.value.dataList[existingIdx] = newParams
            } else {
              indexData.value.dataList.push(newParams)
            }
            
            // 保存索引文件
            const indexContent = serializeIndexFile(indexData.value)
            await writeToFile({ name: indexFileName.value || 'v10_indexdata.dat' }, indexContent)
            console.log('downloadSave: index synced for slot', slotId)
          }
          return true
        }
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

  // 保存用户设置
  const downloadConfig = async () => {
    if (!configData.value) return false
    try {
      const content = serializeConfigFile(configData.value)
      if (dirHandle && configFileHandle) {
        await writeToFile({ name: configFileName.value || 'v10_configdata.dat' }, content)
        return true
      }
      // 下载方式
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

  // 保存设备设置
  const downloadDevice = async () => {
    if (!deviceData.value) return false
    try {
      const content = serializeDeviceFile(deviceData.value)
      if (dirHandle && deviceFileHandle) {
        await writeToFile({ name: deviceFileName.value || 'v10_devicedata.cfg' }, content)
        return true
      }
      // 下载方式
      const blob = new Blob([content], { type: 'text/plain' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = 'v10_devicedata.cfg'
      a.click()
      URL.revokeObjectURL(url)
      return true
    } catch (e) {
      error.value = '设备设置保存失败：' + e.message
      console.error('downloadDevice error:', e)
      return false
    }
  }

  const getMonthText = (period) => getPeriodText(period)

  const hasData = computed(() => saveData.value !== null && saveData.value.status !== undefined)

  const clearData = () => {
    saveData.value = null
    fileName.value = ''
    error.value = null
  }

  const resetDir = async () => {
    await clearDir()
    dirHandle = null
    indexFileHandle = null
    configFileHandle = null
    deviceFileHandle = null
    dirReady.value = false
    dirName.value = ''
    saveSlots.value = []
    saveData.value = null
    fileName.value = ''
    indexData.value = null
    configData.value = null
    deviceData.value = null
    indexFileName.value = ''
    configFileName.value = ''
    deviceFileName.value = ''
    error.value = null
  }

  restoreDir()

  return {
    saveData, isLoading, fileName, error,
    dirReady, dirName, saveSlots,
    indexData, configData, deviceData,
    indexFileName, configFileName, deviceFileName,
    importSave, pickAndImportSave,
    pickDir, loadSlot, refreshSlots,
    loadIndexData, loadConfigData, loadDeviceData,
    exportSave, downloadSave, downloadConfig, downloadDevice,
    getMonthText, hasData, clearData, resetDir
  }
}
