<template>
  <section class="editor-section">
    <h2 class="section-title">轮回数据</h2>
    <div class="card-grid global-grid">
      <div class="card-grid-item card-grid-item--half">
        <n-card title="角色资料" size="small" class="editor-panel">
          <n-form :model="gstatus" label-placement="top">
            <n-grid :cols="24" :x-gap="14" :y-gap="10">
              <n-form-item-gi :span="12" label="玩家名称">
                <n-input v-model:value="gstatus.playerName" />
              </n-form-item-gi>
              <n-form-item-gi :span="12" label="父亲名称">
                <n-input v-model:value="gstatus.fatherName" />
              </n-form-item-gi>
              <n-form-item-gi :span="12" label="父亲昵称">
                <n-input v-model:value="gstatus.fatherGivenName" />
              </n-form-item-gi>

              <n-form-item-gi :span="12" label="父亲生日月">
                <n-input-number v-model:value="gstatus.fatherBirthDay" :min="1" :max="12" />
              </n-form-item-gi>
              <n-form-item-gi :span="12" label="父亲生日日">
                <n-input-number v-model:value="gstatus.fatherBirthDayDate" :min="1" :max="31" />
              </n-form-item-gi>
            </n-grid>
          </n-form>
        </n-card>
      </div>

      <div class="card-grid-item card-grid-item--half">
        <n-card title="轮回进度" size="small" class="editor-panel">
          <n-form :model="gstatus" label-placement="top">
            <n-grid :cols="24" :x-gap="14" :y-gap="10">
              <n-form-item-gi :span="12" label="轮回次数">
                <n-input-number v-model:value="gstatus.loopCount" :min="1" />
              </n-form-item-gi>
              <n-form-item-gi :span="12" label="功绩点数">
                <n-input-number v-model:value="gstatus.acvPoint" :min="0" />
              </n-form-item-gi>
              <n-form-item-gi :span="12" label="玩家生日月">
                <n-input-number v-model:value="gstatus.playerBirthDay" :min="1" :max="12" />
              </n-form-item-gi>
              <n-form-item-gi :span="12" label="玩家生日日">
                <n-input-number v-model:value="gstatus.playerBirthDayDate" :min="1" :max="31" />
              </n-form-item-gi>
            </n-grid>
          </n-form>
        </n-card>
      </div>

      <div class="card-grid-item card-grid-item--half">
        <n-card title="恋爱状态" size="small" class="editor-panel">
          <div class="checkbox-grid">
            <n-checkbox v-model:checked="gstatus.isCoupledCrowa">库洛瓦</n-checkbox>
            <n-checkbox v-model:checked="gstatus.isCoupledChocola">修可拉</n-checkbox>
            <n-checkbox v-model:checked="gstatus.isCoupledFran">弗兰</n-checkbox>
            <n-checkbox v-model:checked="gstatus.isCoupledCornet">可罗奈</n-checkbox>
            <n-checkbox v-model:checked="gstatus.isCoupledShaile">夏尔</n-checkbox>
            <n-checkbox v-model:checked="gstatus.isCoupledHasis">哈希斯</n-checkbox>
            <n-checkbox v-model:checked="gstatus.isCoupledNoah">诺亚</n-checkbox>
          </div>
        </n-card>
      </div>

      <div class="card-grid-item card-grid-item--half">
        <n-card title="结局标记" size="small" class="editor-panel">
          <div class="checkbox-grid checkbox-grid--compact">
            <n-checkbox v-model:checked="gstatus.isShowTrueEnding">已显示真结局</n-checkbox>
            <n-checkbox v-model:checked="gstatus.isShowAnotherEnding">已显示隐藏结局</n-checkbox>
            <n-checkbox v-model:checked="gstatus.isNextLoopStart">下周目开始</n-checkbox>
          </div>
        </n-card>
      </div>
    </div>
  </section>
</template>

<script>
import { NForm, NGrid, NFormItemGi, NInputNumber, NInput, NCard, NCheckbox } from 'naive-ui'

export default {
  name: 'GlobalEditor',
  components: { NForm, NGrid, NFormItemGi, NInputNumber, NInput, NCard, NCheckbox },
  props: {
    gstatus: {
      type: Object,
      required: true
    }
  }
}
</script>

<style scoped>
.global-grid {
  gap: 20px;
}

.editor-panel :deep(.n-card__content) {
  padding-top: 14px;
  padding-bottom: 18px;
}

.editor-panel :deep(.n-form-item-blank) {
  justify-content: flex-start;
}

.editor-panel :deep(.n-input-number),
.editor-panel :deep(.n-input),
.editor-panel :deep(.n-select) {
  max-width: 280px;
}

.checkbox-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px 18px;
}

.checkbox-grid--compact {
  gap: 12px;
}
</style>
