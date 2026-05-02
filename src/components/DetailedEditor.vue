<template>
  <section class="editor-section">
    <h2 class="section-title">详细属性</h2>

    <div class="card-grid detailed-grid">
      <div class="card-grid-item card-grid-item--half">
        <n-card title="四维等级 (1-18)" size="small" class="editor-panel">
          <n-form :model="status" label-placement="top">
            <n-grid :cols="24" :x-gap="14" :y-gap="10">
              <n-form-item-gi :span="12" label="体力等级">
                <n-input-number v-model:value="status.levelPhysical" :min="1" :max="18" />
              </n-form-item-gi>
              <n-form-item-gi :span="12" label="智力等级">
                <n-input-number v-model:value="status.levelIntelligence" :min="1" :max="18" />
              </n-form-item-gi>
              <n-form-item-gi :span="12" label="魅力等级">
                <n-input-number v-model:value="status.levelCharm" :min="1" :max="18" />
              </n-form-item-gi>
              <n-form-item-gi :span="12" label="感性等级">
                <n-input-number v-model:value="status.levelSense" :min="1" :max="18" />
              </n-form-item-gi>
            </n-grid>
          </n-form>
        </n-card>
      </div>

      <div class="card-grid-item card-grid-item--half">
        <n-card title="战斗属性" size="small" class="editor-panel">
          <n-form :model="status" label-placement="top">
            <n-grid :cols="24" :x-gap="14" :y-gap="10">
              <n-form-item-gi :span="12" label="战斗等级">
                <n-input-number v-model:value="status.levelBattle" :min="1" :max="18" />
              </n-form-item-gi>
              <n-form-item-gi :span="12" label="技能等级">
                <n-input-number v-model:value="status.levelArts" :min="1" :max="18" />
              </n-form-item-gi>
              <n-form-item-gi :span="12" label="魔术等级">
                <n-input-number v-model:value="status.levelMagic" :min="1" :max="18" />
              </n-form-item-gi>
              <n-form-item-gi :span="12" label="战斗经验">
                <n-input-number v-model:value="status.btlExp" :min="0" :max="99999" />
              </n-form-item-gi>
            </n-grid>
          </n-form>
        </n-card>
      </div>

      <div class="card-grid-item card-grid-item--half">
        <n-card title="体力属性" size="small" class="editor-panel">
          <n-form :model="status" label-placement="top">
            <n-grid :cols="24" :x-gap="12" :y-gap="10">
              <n-form-item-gi :span="12" label="体力经验">
                <n-input-number v-model:value="status.valuePhysical" :min="0" />
              </n-form-item-gi>
              <n-form-item-gi :span="12" label="力量">
                <n-input-number v-model:value="status.phyKinryoku" :min="0" :max="9999" />
              </n-form-item-gi>
              <n-form-item-gi :span="12" label="生命">
                <n-input-number v-model:value="status.phySeimei" :min="0" :max="9999" />
              </n-form-item-gi>
              <n-form-item-gi :span="12" label="意志">
                <n-input-number v-model:value="status.phyKonjyo" :min="0" :max="9999" />
              </n-form-item-gi>
              <n-form-item-gi :span="12" label="敏捷">
                <n-input-number v-model:value="status.phyBinsho" :min="0" :max="9999" />
              </n-form-item-gi>
            </n-grid>
          </n-form>
        </n-card>
      </div>

      <div class="card-grid-item card-grid-item--half">
        <n-card title="智力属性" size="small" class="editor-panel">
          <n-form :model="status" label-placement="top">
            <n-grid :cols="24" :x-gap="12" :y-gap="10">
              <n-form-item-gi :span="12" label="智力经验">
                <n-input-number v-model:value="status.valueIntelligence" :min="0" />
              </n-form-item-gi>
              <n-form-item-gi :span="12" label="文学">
                <n-input-number v-model:value="status.intBungaku" :min="0" :max="9999" />
              </n-form-item-gi>
              <n-form-item-gi :span="12" label="算术">
                <n-input-number v-model:value="status.intSanjyutsu" :min="0" :max="9999" />
              </n-form-item-gi>
              <n-form-item-gi :span="12" label="魔术">
                <n-input-number v-model:value="status.intMajyutsu" :min="0" :max="9999" />
              </n-form-item-gi>
              <n-form-item-gi :span="12" label="信仰">
                <n-input-number v-model:value="status.intShinkou" :min="0" :max="9999" />
              </n-form-item-gi>
            </n-grid>
          </n-form>
        </n-card>
      </div>

      <div class="card-grid-item card-grid-item--half">
        <n-card title="魅力属性" size="small" class="editor-panel">
          <n-form :model="status" label-placement="top">
            <n-grid :cols="24" :x-gap="12" :y-gap="10">
              <n-form-item-gi :span="12" label="魅力经验">
                <n-input-number v-model:value="status.valueCharm" :min="0" />
              </n-form-item-gi>
              <n-form-item-gi :span="12" label="美貌">
                <n-input-number v-model:value="status.chaBibou" :min="0" :max="9999" />
              </n-form-item-gi>
              <n-form-item-gi :span="12" label="社交">
                <n-input-number v-model:value="status.chaShakou" :min="0" :max="9999" />
              </n-form-item-gi>
              <n-form-item-gi :span="12" label="礼仪">
                <n-input-number v-model:value="status.chaReigi" :min="0" :max="9999" />
              </n-form-item-gi>
              <n-form-item-gi :span="12" label="道德">
                <n-input-number v-model:value="status.chaDoutoku" :min="0" :max="9999" />
              </n-form-item-gi>
            </n-grid>
          </n-form>
        </n-card>
      </div>

      <div class="card-grid-item card-grid-item--half">
        <n-card title="感性属性" size="small" class="editor-panel">
          <n-form :model="status" label-placement="top">
            <n-grid :cols="24" :x-gap="12" :y-gap="10">
              <n-form-item-gi :span="12" label="感性经验">
                <n-input-number v-model:value="status.valueSense" :min="0" />
              </n-form-item-gi>
              <n-form-item-gi :span="12" label="想象">
                <n-input-number v-model:value="status.senSouzou" :min="0" :max="9999" />
              </n-form-item-gi>
              <n-form-item-gi :span="12" label="创意">
                <n-input-number v-model:value="status.senSousaku" :min="0" :max="9999" />
              </n-form-item-gi>
              <n-form-item-gi :span="12" label="音乐">
                <n-input-number v-model:value="status.senOnkan" :min="0" :max="9999" />
              </n-form-item-gi>
              <n-form-item-gi :span="12" label="美术">
                <n-input-number v-model:value="status.senBikan" :min="0" :max="9999" />
              </n-form-item-gi>
            </n-grid>
          </n-form>
        </n-card>
      </div>
    </div>
  </section>
</template>

<script>
import { NForm, NGrid, NGi, NCard, NFormItemGi, NInputNumber } from 'naive-ui'

export default {
  name: 'DetailedEditor',
  components: { NForm, NGrid, NGi, NCard, NFormItemGi, NInputNumber },
  props: {
    status: {
      type: Object,
      required: true
    }
  }
}
</script>

<style scoped>
.detailed-grid {
  gap: 18px;
}

.editor-panel :deep(.n-card__content) {
  padding-top: 14px;
  padding-bottom: 18px;
}

.editor-panel :deep(.n-form-item-blank) {
  justify-content: flex-start;
}

.editor-panel :deep(.n-input-number) {
  max-width: 260px;
}
</style>
