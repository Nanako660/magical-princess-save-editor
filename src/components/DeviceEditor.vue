<template>
  <section class="editor-section">
    <h2 class="section-title">设备设置</h2>
    
    <div class="card-grid">
      <div class="card-grid-item card-grid-item--full">
        <n-card title="显示设置" size="small">
          <n-form :model="device" label-placement="top">
            <n-grid :cols="24" :x-gap="24" :y-gap="12" responsive="screen">
              <n-form-item-gi span="24 s:12 m:8 xl:6" label="全屏模式">
                <n-switch v-model:value="device.isFullScreen" />
              </n-form-item-gi>
              <n-form-item-gi span="24 s:12 m:8 xl:6" label="分辨率">
                <n-select 
                  v-model:value="device.resolutionListId" 
                  :options="resolutionOptions"
                  placeholder="选择分辨率"
                />
              </n-form-item-gi>
              <n-form-item-gi span="24 s:12 m:8 xl:6" label="画质">
                <n-select 
                  v-model:value="device.qualityListType" 
                  :options="qualityOptions"
                  placeholder="选择画质"
                />
              </n-form-item-gi>
            </n-grid>
          </n-form>
        </n-card>
      </div>
    </div>
    
    <n-alert type="info" style="margin-top: 24px;">
      <template #icon>
        <n-icon><InformationCircleOutline /></n-icon>
      </template>
      设备设置修改后需要重启游戏生效。
    </n-alert>
  </section>
</template>

<script>
import { computed } from 'vue'
import { NCard, NForm, NGrid, NFormItemGi, NSelect, NSwitch, NAlert, NIcon } from 'naive-ui'
import { InformationCircleOutline } from '@vicons/ionicons5'
import { QualityType, ResolutionMap } from '../data/enums.js'

export default {
  name: 'DeviceEditor',
  components: { NCard, NForm, NGrid, NFormItemGi, NSelect, NSwitch, NAlert, NIcon, InformationCircleOutline },
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
