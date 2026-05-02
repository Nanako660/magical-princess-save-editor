<template>
  <div class="file-handler">
    <n-button @click="triggerImport" type="primary" :loading="isLoading">
      {{ isLoading ? '加载中...' : '导入存档' }}
    </n-button>
    <n-button @click="handleExport" type="success" :disabled="!hasData || isLoading">
      导出存档
    </n-button>
    <input 
      type="file" 
      ref="fileInput" 
      @change="handleFileChange" 
      accept=".dat" 
      class="hidden-input"
    >
    <n-text v-if="fileName" depth="3" class="file-name">当前: {{ fileName }}</n-text>
  </div>
</template>

<script>
import { ref } from 'vue'
import { NButton, NText } from 'naive-ui'

export default {
  name: 'FileHandler',
  
  components: { NButton, NText },
  
  props: {
    hasData: { type: Boolean, default: false },
    isLoading: { type: Boolean, default: false },
    fileName: { type: String, default: '' }
  },
  
  emits: ['import', 'export'],
  
  setup(props, { emit }) {
    const fileInput = ref(null)
    
    const triggerImport = () => {
      fileInput.value?.click()
    }
    
    const handleFileChange = (event) => {
      const file = event.target.files[0]
      if (file) emit('import', file)
      event.target.value = ''
    }
    
    const handleExport = () => {
      emit('export')
    }
    
    return { fileInput, triggerImport, handleFileChange, handleExport }
  }
}
</script>

<style scoped>
.file-handler {
  display: flex;
  gap: 12px;
  align-items: center;
}
.hidden-input {
  display: none;
}
.file-name {
  margin-left: 8px;
}
</style>