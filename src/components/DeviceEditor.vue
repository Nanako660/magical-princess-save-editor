<template>
  <section class="editor-section">
    <h2 class="section-title">设备设置</h2>
    
    <n-card title="显示设置" size="small" style="margin-bottom: 16px;">
      <n-form :model="device" label-placement="left" label-width="100">
        <n-form-item label="全屏模式">
          <n-switch v-model:value="device.isFullScreen" />
        </n-form-item>
        <n-form-item label="分辨率">
          <n-select 
            v-model:value="device.resolutionListId" 
            :options="resolutionOptions"
            placeholder="选择分辨率"
          />
        </n-form-item>
        <n-form-item label="画质">
          <n-select 
            v-model:value="device.qualityListType" 
            :options="qualityOptions"
            placeholder="选择画质"
          />
        </n-form-item>
      </n-form>
    </n-card>
    
    <n-alert type="info" style="margin-top: 16px;">
      <template #icon>
        <n-icon><InformationCircleOutline /></n-icon>
      </template>
      设备设置修改后需要重启游戏生效。
    </n-alert>
  </section>
</template>

<script>
import { computed } from 'vue'
import { NCard, NForm, NFormItem, NSelect, NSwitch, NAlert, NIcon } from 'naive-ui'
import { InformationCircleOutline } from '@vicons/ionicons5'
import { QualityType, ResolutionMap } from '../data/enums.js'

export default {
  name: 'DeviceEditor',
  components: { NCard, NForm, NFormItem, NSelect, NSwitch, NAlert, NIcon, InformationCircleOutline },
  props: {
    device: { type: Object, required: true }
  },
  setup(props) {
    const resolutionOptions = computed(() => 
      Object.entries(ResolutionMap).map(([value, label]) => ({
        label,
        value: parseInt(value)
      }))
    )
    
    const qualityOptions = computed(() => 
      Object.entries(QualityType).map(([value, label]) => ({
        label,
        value: parseInt(value)
      }))
    )
    
    return { resolutionOptions, qualityOptions }
  }
}
</script>

<style scoped>
.section-title {
  margin-bottom: 1.5rem;
  color: #667eea;
  border-bottom: 2px solid #667eea;
  padding-bottom: 0.5rem;
}
</style>