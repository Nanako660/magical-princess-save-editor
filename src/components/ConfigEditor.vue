<template>
  <section class="editor-section">
    <h2 class="section-title">用户设置</h2>
    
    <div class="card-grid">
      <div class="card-grid-item card-grid-item--full">
        <n-card title="语言与音量" size="small">
          <n-form :model="config" label-placement="top">
            <n-grid :cols="24" :x-gap="24" :y-gap="12" responsive="screen">
              <n-form-item-gi span="24 s:12 m:8 xl:6" label="语言">
                <n-select 
                  v-model:value="config.lang" 
                  :options="langOptions"
                  placeholder="选择语言"
                />
              </n-form-item-gi>
              <n-form-item-gi span="24 s:12 m:8 xl:6" label="跳过模式">
                <n-switch v-model:value="config.isCastingMode" />
              </n-form-item-gi>
              <n-form-item-gi span="24 s:12 m:8 xl:6" label="BGM 音量">
                <n-slider 
                  v-model:value="config.volumeBGM" 
                  :min="0" 
                  :max="1" 
                  :step="0.01"
                  :tooltip="true"
                />
              </n-form-item-gi>
              <n-form-item-gi span="24 s:12 m:8 xl:6" label="SE 音量">
                <n-slider 
                  v-model:value="config.volumeSE" 
                  :min="0" 
                  :max="1" 
                  :step="0.01"
                  :tooltip="true"
                />
              </n-form-item-gi>
              <n-form-item-gi span="24 s:12 m:8 xl:6" label="语音音量">
                <n-slider 
                  v-model:value="config.volumeVoice" 
                  :min="0" 
                  :max="1" 
                  :step="0.01"
                  :tooltip="true"
                />
              </n-form-item-gi>
              <n-form-item-gi span="24 s:12 m:8 xl:6" label="消息速度">
                <n-slider 
                  v-model:value="config.messageSpeed" 
                  :min="0.5" 
                  :max="2" 
                  :step="0.1"
                  :tooltip="true"
                />
              </n-form-item-gi>
            </n-grid>
          </n-form>
        </n-card>
      </div>
    </div>
  </section>
</template>

<script>
import { computed } from 'vue'
import { 
  NCard, NForm, NGrid, NFormItemGi, NSelect, NSwitch, NSlider 
} from 'naive-ui'
import { LangType } from '../data/enums.js'

export default {
  name: 'ConfigEditor',
  components: { NCard, NForm, NGrid, NFormItemGi, NSelect, NSwitch, NSlider },
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
