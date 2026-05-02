import { ref, computed } from 'vue'
import { parseSaveFile, serializeSaveFile, getPeriodText } from '../utils/saveParser.js'
import { saveDirHandle, loadDirHandle, verifyPermission, clearDir } from '../utils/dirStore.js'

const hasFSA = typeof window.showOpenFilePicker === 'function'

const SAVE_PATTERN = /^v10_userdata(\d+)\.dat$/

export function useSaveData() {
  const saveData = ref(null)
  const isLoading = ref(false)
  const fileName = ref('')
  const error = ref(null)

  const dirReady = ref(false)
  const dirName = ref('')
  const saveSlots = ref([])

  let dirHandle = null

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
      dirHandle = handle
      dirName.value = handle.name
      dirReady.value = true
      await saveDirHandle(handle)
      await refreshSlots()
      return true
    } catch (e) {
      if (e.name !== 'AbortError') console.error('pickDir error:', e)
      return false
    }
  }

  async function refreshSlots() {
    if (!dirHandle) { saveSlots.value = []; return }
    const slots = []
    try {
      for await (const [name, fh] of dirHandle) {
        const m = name.match(SAVE_PATTERN)
        if (m && fh.kind === 'file') {
          const file = await fh.getFile()
          slots.push({
            slotId: parseInt(m[1]),
            name,
            size: file.size,
            lastModified: file.lastModified,
            handle: fh
          })
        }
      }
      slots.sort((a, b) => a.slotId - b.slotId)
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
    dirReady.value = false
    dirName.value = ''
    saveSlots.value = []
    saveData.value = null
    fileName.value = ''
    error.value = null
  }

  restoreDir()

  return {
    saveData, isLoading, fileName, error,
    dirReady, dirName, saveSlots,
    importSave, pickAndImportSave,
    pickDir, loadSlot, refreshSlots,
    exportSave, downloadSave,
    getMonthText, hasData, clearData, resetDir
  }
}
