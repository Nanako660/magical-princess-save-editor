<template>
  <section class="editor-section">
    <h2 class="section-title">用户设置</h2>
    
    <n-card title="语言与显示" size="small" style="margin-bottom: 16px;">
      <n-form :model="config" label-placement="left" label-width="100">
        <n-form-item label="语言">
          <n-select 
            v-model:value="config.lang" 
            :options="langOptions"
            placeholder="选择语言"
          />
        </n-form-item>
        <n-form-item label="跳过模式">
          <n-switch v-model:value="config.isCastingMode" />
        </n-form-item>
      </n-form>
    </n-card>
    
    <n-card title="音量设置" size="small" style="margin-bottom: 16px;">
      <n-form :model="config" label-placement="left" label-width="100">
        <n-form-item label="BGM 音量">
          <n-slider 
            v-model:value="config.volumeBGM" 
            :min="0" 
            :max="1" 
            :step="0.01"
            :tooltip="true"
          />
          <n-input-number 
            v-model:value="config.volumeBGM" 
            :min="0" 
            :max="1" 
            :step="0.01"
            size="small"
            style="width: 80px; margin-left: 12px;"
          />
        </n-form-item>
        <n-form-item label="SE 音量">
          <n-slider 
            v-model:value="config.volumeSE" 
            :min="0" 
            :max="1" 
            :step="0.01"
            :tooltip="true"
          />
          <n-input-number 
            v-model:value="config.volumeSE" 
            :min="0" 
            :max="1" 
            :step="0.01"
            size="small"
            style="width: 80px; margin-left: 12px;"
          />
        </n-form-item>
        <n-form-item label="语音音量">
          <n-slider 
            v-model:value="config.volumeVoice" 
            :min="0" 
            :max="1" 
            :step="0.01"
            :tooltip="true"
          />
          <n-input-number 
            v-model:value="config.volumeVoice" 
            :min="0" 
            :max="1" 
            :step="0.01"
            size="small"
            style="width: 80px; margin-left: 12px;"
          />
        </n-form-item>
      </n-form>
    </n-card>
    
    <n-card title="消息速度" size="small">
      <n-form :model="config" label-placement="left" label-width="100">
        <n-form-item label="速度">
          <n-slider 
            v-model:value="config.messageSpeed" 
            :min="0.5" 
            :max="2" 
            :step="0.1"
            :tooltip="true"
          />
          <n-input-number 
            v-model:value="config.messageSpeed" 
            :min="0.5" 
            :max="2" 
            :step="0.1"
            size="small"
            style="width: 80px; margin-left: 12px;"
          />
        </n-form-item>
      </n-form>
    </n-card>
  </section>
</template>

<script>
import { computed } from 'vue'
import { 
  NCard, NForm, NFormItem, NSelect, NSwitch, NSlider, NInputNumber 
} from 'naive-ui'
import { LangType, LangTypeReverse } from '../data/enums.js'

export default {
  name: 'ConfigEditor',
  components: { NCard, NForm, NFormItem, NSelect, NSwitch, NSlider, NInputNumber },
  props: {
    config: { type: Object, required: true }
  },
  setup(props) {
    const langOptions = computed(() => 
      Object.entries(LangType).map(([value, label]) => ({
        label,
        value: parseInt(value)
      }))
    )
    
    return { langOptions }
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