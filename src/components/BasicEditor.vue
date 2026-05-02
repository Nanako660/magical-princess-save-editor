<template>
  <section class="editor-section">
    <h2 class="section-title">基础属性</h2>
    <div class="card-grid">
      <div class="card-grid-item card-grid-item--wide">
        <n-card title="时间与资源" size="small">
          <n-form :model="status" label-placement="top">
            <n-grid :cols="24" :x-gap="24" :y-gap="12" responsive="screen">
              <n-form-item-gi span="24 s:12 m:8 xl:8" label="当前月份">
                <n-input-group>
                  <n-input-number v-model:value="status.period" :min="0" :max="42" style="flex: 1;" />
                  <n-input-group-label>{{ periodText }}</n-input-group-label>
                </n-input-group>
              </n-form-item-gi>
              <n-form-item-gi span="24 s:12 m:8 xl:8" label="金钱">
                <n-input-number v-model:value="status.money" :min="0" :max="9999999" />
              </n-form-item-gi>
              <n-form-item-gi span="24 s:12 m:8 xl:8" label="东亚硬币">
                <n-input-number v-model:value="status.blackCoin" :min="0" :max="9999" />
              </n-form-item-gi>
              <n-form-item-gi span="24 s:12 m:8 xl:8" label="行动力">
                <n-input-number v-model:value="status.activePower" :min="0" :max="99" />
              </n-form-item-gi>
              <n-form-item-gi span="24 s:12 m:8 xl:8" label="最大行动力">
                <n-input-number v-model:value="status.activePowerMax" :min="0" :max="99" />
              </n-form-item-gi>
            </n-grid>
          </n-form>
        </n-card>
      </div>

      <div class="card-grid-item card-grid-item--half">
        <n-card title="倾向与成长" size="small">
          <n-form :model="status" label-placement="top">
            <n-grid :cols="24" :x-gap="24" :y-gap="12" responsive="screen">
              <n-form-item-gi span="24 s:12 xl:12" label="压力">
                <n-input-number v-model:value="status.stress" :min="0" :max="100" />
              </n-form-item-gi>
              <n-form-item-gi span="24 s:12 xl:12" label="善行值">
                <n-input-number v-model:value="status.goodAction" :min="1" />
              </n-form-item-gi>
              <n-form-item-gi span="24 s:12 xl:12" label="恶行值">
                <n-input-number v-model:value="status.badAction" :min="1" />
              </n-form-item-gi>
              <n-form-item-gi span="24 s:12 xl:12" label="善恶平衡">
                <n-input-number v-model:value="status.gbBalance" :min="0" :max="100" />
              </n-form-item-gi>
              <n-form-item-gi span="24 s:12 xl:12" label="声望">
                <n-input-number v-model:value="status.reputation" :min="0" :max="9999" />
              </n-form-item-gi>
              <n-form-item-gi span="24 s:12 xl:12" label="技能点">
                <n-input-number v-model:value="status.skillPoint" :min="0" :max="9999" />
              </n-form-item-gi>
            </n-grid>
          </n-form>
        </n-card>
      </div>

      <div class="card-grid-item card-grid-item--third">
        <n-card title="身份与关系" size="small">
          <n-form :model="status" label-placement="top">
            <n-grid :cols="24" :x-gap="24" :y-gap="12" responsive="screen">
              <n-form-item-gi span="24" label="学院职业">
                <n-select v-model:value="status.acClass" :options="academyOptions" />
              </n-form-item-gi>
              <n-form-item-gi span="24 s:12 xl:24" label="父亲好感度">
                <n-input-number v-model:value="status.fatherFavarite" :min="0" :max="100" />
              </n-form-item-gi>
              <n-form-item-gi span="24 s:12 xl:24" label="父爱等级">
                <n-input-number v-model:value="status.fatherFavLevel" :min="1" :max="7" />
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
import { NForm, NGrid, NFormItemGi, NInputNumber, NSelect, NInputGroup, NInputGroupLabel, NCard } from 'naive-ui'
import { AcademyClass } from '../data/enums.js'
import { getPeriodText } from '../data/periodData.js'

export default {
  name: 'BasicEditor',
  components: { NForm, NGrid, NFormItemGi, NInputNumber, NSelect, NInputGroup, NInputGroupLabel, NCard },
  props: {
    status: { type: Object, required: true }
  },
  setup(props) {
    const periodText = computed(() => getPeriodText(props.status.period))
    const academyOptions = computed(() => {
      return Object.entries(AcademyClass).map(([val, name]) => ({
        label: name,
        value: parseInt(val)
      }))
    })
    
    return {
      periodText,
      academyOptions
    }
  }
}
</script>

