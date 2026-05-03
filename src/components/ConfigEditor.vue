<template>
  <section class="editor-section">
    <h2 class="section-title">游戏设置</h2>
    
    <div class="card-grid">
      <div class="card-grid-item card-grid-item--full">
        <n-card title="语言与音量" size="small">
          <n-form :model="config" label-placement="top">
            <n-grid :cols="24" :x-gap="24" :y-gap="12" responsive="screen">
              <n-form-item-gi span="24 s:12" label="语言">
                <n-select 
                  v-model:value="config.lang" 
                  :options="langOptions"
                  placeholder="选择语言"
                />
              </n-form-item-gi>
              <n-form-item-gi span="24 s:12" label="背景乐音量">
                <n-slider 
                  v-model:value="config.volumeBGM" 
                  :min="0" 
                  :max="1" 
                  :step="0.05"
                  :format-tooltip="formatPercent"
                />
              </n-form-item-gi>
              <n-form-item-gi span="24 s:12" label="音效音量">
                <n-slider 
                  v-model:value="config.volumeSE" 
                  :min="0" 
                  :max="1" 
                  :step="0.05"
                  :format-tooltip="formatPercent"
                />
              </n-form-item-gi>
              <n-form-item-gi span="24 s:12" label="语音音量">
                <n-slider 
                  v-model:value="config.volumeVoice" 
                  :min="0" 
                  :max="1" 
                  :step="0.05"
                  :format-tooltip="formatPercent"
                />
              </n-form-item-gi>
              <n-form-item-gi span="24 s:12" label="文本显示速度">
                <n-slider
                  v-model:value="messageSpeedPreset"
                  :min="0"
                  :max="4"
                  :step="1"
                  :marks="messageSpeedMarks"
                  :format-tooltip="formatMessageSpeed"
                />
              </n-form-item-gi>
              <n-form-item-gi span="24 s:12" label="直播模式（关闭歌曲人声）">
                <n-switch v-model:value="config.isCastingMode" />
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

const MESSAGE_SPEED_OPTIONS = [
  { label: 'x1.0', value: 1 },
  { label: 'x1.5', value: 1.5 },
  { label: 'x2.0', value: 2 },
  { label: 'x2.5', value: 2.5 },
  { label: 'MAX', value: 1000 }
]

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

    const messageSpeedMarks = Object.fromEntries(
      MESSAGE_SPEED_OPTIONS.map((option, index) => [index, option.label])
    )

    const getClosestMessageSpeedIndex = (value) => {
      const target = Number(value)
      if (!Number.isFinite(target)) return 0

      let closestIndex = 0
      let closestDistance = Infinity

      MESSAGE_SPEED_OPTIONS.forEach((option, index) => {
        const distance = Math.abs(option.value - target)
        if (distance < closestDistance) {
          closestDistance = distance
          closestIndex = index
        }
      })

      return closestIndex
    }

    const messageSpeedPreset = computed({
      get: () => getClosestMessageSpeedIndex(props.config.messageSpeed),
      set: (index) => {
        const option = MESSAGE_SPEED_OPTIONS[index] || MESSAGE_SPEED_OPTIONS[0]
        props.config.messageSpeed = option.value
      }
    })

    const formatPercent = (value) => `${Math.round(Number(value) * 100)}%`
    const formatMessageSpeed = (index) => {
      const option = MESSAGE_SPEED_OPTIONS[index] || MESSAGE_SPEED_OPTIONS[0]
      return option.label
    }
    
    return {
      langOptions,
      messageSpeedMarks,
      messageSpeedPreset,
      formatPercent,
      formatMessageSpeed
    }
  }
}
</script>
