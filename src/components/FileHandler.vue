<template>
  <div class="file-handler">
    <n-button v-if="!dirReady" @click="$emit('pickDir')" type="warning" quaternary>
      选择存档目录
    </n-button>

    <template v-if="dirReady">
      <n-popover trigger="click" placement="bottom-start" :style="{ maxWidth: '320px' }">
        <template #trigger>
          <n-button quaternary type="info">
            <template #icon><n-icon><FolderOpenOutline /></n-icon></template>
            {{ dirName }} ({{ saveSlots.length }}个存档)
          </n-button>
        </template>
        <n-scrollbar style="max-height: 300px">
          <div class="slot-list">
            <div v-if="saveSlots.length === 0" class="slot-empty">目录中没有找到存档文件</div>
            <div
              v-for="slot in saveSlots"
              :key="slot.slotId"
              class="slot-item"
              @click="$emit('loadSlot', slot)"
            >
              <span class="slot-name">{{ slot.name }}</span>
              <span class="slot-meta">槽位 {{ slot.slotId }} · {{ formatSize(slot.size) }}</span>
            </div>
          </div>
        </n-scrollbar>
      </n-popover>
    </template>

    <n-button @click="triggerImport" type="primary" :loading="isLoading" quaternary>
      {{ isLoading ? '加载中...' : '导入存档' }}
    </n-button>

    <n-button @click="$emit('export')" type="success" :disabled="!hasData || isLoading" quaternary>
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
import { NButton, NText, NPopover, NIcon, NScrollbar } from 'naive-ui'
import { FolderOpenOutline } from '@vicons/ionicons5'

export default {
  name: 'FileHandler',
  components: { NButton, NText, NPopover, NIcon, NScrollbar, FolderOpenOutline },
  props: {
    hasData: { type: Boolean, default: false },
    isLoading: { type: Boolean, default: false },
    fileName: { type: String, default: '' },
    dirReady: { type: Boolean, default: false },
    dirName: { type: String, default: '' },
    saveSlots: { type: Array, default: () => [] }
  },
  emits: ['import', 'export', 'pickDir', 'loadSlot'],
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

    const formatSize = (bytes) => {
      if (bytes < 1024) return bytes + ' B'
      return (bytes / 1024).toFixed(1) + ' KB'
    }

    return { fileInput, triggerImport, handleFileChange, formatSize }
  }
}
</script>

<style scoped>
.file-handler {
  display: flex;
  gap: 8px;
  align-items: center;
}
.hidden-input {
  display: none;
}
.file-name {
  margin-left: 4px;
  white-space: nowrap;
}
.slot-list {
  min-width: 240px;
}
.slot-empty {
  padding: 8px 4px;
  color: #999;
  font-size: 0.85rem;
  text-align: center;
}
.slot-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 6px 4px;
  cursor: pointer;
  border-radius: 4px;
  gap: 12px;
}
.slot-item:hover {
  background: rgba(102, 126, 234, 0.15);
}
.slot-name {
  font-weight: 600;
  font-size: 0.9rem;
}
.slot-meta {
  font-size: 0.75rem;
  color: #888;
  white-space: nowrap;
}
</style>
