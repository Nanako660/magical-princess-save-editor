import { ref, computed } from 'vue'
import { parseSaveFile, serializeSaveFile, getPeriodText } from '../utils/saveParser.js'

/**
 * 存档数据管理 Composable
 * 负责存档的加载、解析、导出
 */
export function useSaveData() {
  const saveData = ref(null)
  const isLoading = ref(false)
  const fileName = ref('')
  const error = ref(null)

  /**
   * 导入存档文件
   * @param {File} file - 用户选择的文件
   */
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

  /**
   * 导出存档文件
   */
  const exportSave = () => {
    if (!saveData.value) {
      error.value = '没有可导出的数据'
      return null
    }
    
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

  /**
   * 下载导出的文件
   */
  const downloadSave = () => {
    const result = exportSave()
    if (!result) return
    
    const blob = new Blob([result.content], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = result.fileName
    a.click()
    URL.revokeObjectURL(url)
  }

  /**
   * 获取月份显示文本
   */
  const getMonthText = (period) => {
    return getPeriodText(period)
  }

  /**
   * 检查是否已加载存档
   */
  const hasData = computed(() => {
    return saveData.value !== null && saveData.value.status !== undefined
  })

  /**
   * 清除当前数据
   */
  const clearData = () => {
    saveData.value = null
    fileName.value = ''
    error.value = null
  }

  return {
    // 状态
    saveData,
    isLoading,
    fileName,
    error,
    
    // 方法
    importSave,
    exportSave,
    downloadSave,
    getMonthText,
    hasData,
    clearData
  }
}
