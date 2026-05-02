<template>
  <section class="editor-section">
    <h2 class="section-title">跨轮回数据</h2>
    <n-form :model="gstatus" label-placement="top">
      <n-grid :cols="1" :y-gap="24">
        <n-gi>
          <n-card title="基础轮回信息" size="small">
            <n-grid :cols="24" :x-gap="24" :y-gap="12" responsive="screen">
              <n-form-item-gi :span="6" label="轮回次数">
                <n-input-number v-model:value="gstatus.loopCount" :min="1" />
              </n-form-item-gi>
              <n-form-item-gi :span="6" label="玩家名称">
                <n-input v-model:value="gstatus.playerName" />
              </n-form-item-gi>
              <n-form-item-gi :span="6" label="父亲名称">
                <n-input v-model:value="gstatus.fatherName" />
              </n-form-item-gi>
              <n-form-item-gi :span="6" label="父亲昵称">
                <n-input v-model:value="gstatus.fatherGivenName" />
              </n-form-item-gi>
              
              <n-form-item-gi :span="6" label="玩家生日月">
                <n-input-number v-model:value="gstatus.playerBirthDay" :min="1" :max="12" />
              </n-form-item-gi>
              <n-form-item-gi :span="6" label="玩家生日日">
                <n-input-number v-model:value="gstatus.playerBirthDayDate" :min="1" :max="31" />
              </n-form-item-gi>
              <n-form-item-gi :span="6" label="父亲生日月">
                <n-input-number v-model:value="gstatus.fatherBirthDay" :min="1" :max="12" />
              </n-form-item-gi>
              <n-form-item-gi :span="6" label="父亲生日日">
                <n-input-number v-model:value="gstatus.fatherBirthDayDate" :min="1" :max="31" />
              </n-form-item-gi>
              <n-form-item-gi :span="6" label="成就点数">
                <n-input-number v-model:value="gstatus.acvPoint" :min="0" />
              </n-form-item-gi>
            </n-grid>
          </n-card>
        </n-gi>

        <n-gi>
          <n-card title="结局标记" size="small">
            <n-space>
              <n-checkbox v-model:checked="gstatus.isShowTrueEnding">已显示真结局</n-checkbox>
              <n-checkbox v-model:checked="gstatus.isShowAnotherEnding">已显示隐藏结局</n-checkbox>
              <n-checkbox v-model:checked="gstatus.isNextLoopStart">下周目开始</n-checkbox>
            </n-space>
          </n-card>
        </n-gi>

        <n-gi>
          <n-card title="恋爱状态" size="small">
            <n-space>
              <n-checkbox v-model:checked="gstatus.isCoupledCrowa">克洛瓦</n-checkbox>
              <n-checkbox v-model:checked="gstatus.isCoupledChocola">巧克拉</n-checkbox>
              <n-checkbox v-model:checked="gstatus.isCoupledFran">弗兰</n-checkbox>
              <n-checkbox v-model:checked="gstatus.isCoupledCornet">科内特</n-checkbox>
              <n-checkbox v-model:checked="gstatus.isCoupledShaile">夏尔</n-checkbox>
              <n-checkbox v-model:checked="gstatus.isCoupledHasis">哈希斯</n-checkbox>
              <n-checkbox v-model:checked="gstatus.isCoupledNoah">诺亚</n-checkbox>
            </n-space>
          </n-card>
        </n-gi>
      </n-grid>
    </n-form>
  </section>
</template>

<script>
import { NForm, NGrid, NGi, NFormItemGi, NInputNumber, NInput, NCard, NCheckbox, NSpace } from 'naive-ui'

export default {
  name: 'GlobalEditor',
  components: { NForm, NGrid, NGi, NFormItemGi, NInputNumber, NInput, NCard, NCheckbox, NSpace },
  props: {
    gstatus: {
      type: Object,
      required: true
    }
  }
}
</script>

<style scoped>
.editor-section { max-width: 1200px; }
.section-title {
  margin-bottom: 1.5rem;
  color: #667eea;
  border-bottom: 2px solid #667eea;
  padding-bottom: 0.5rem;
}
</style>