<template>
  <section class="editor-section">
    <h2 class="section-title">详细属性</h2>
    
    <n-form :model="status" label-placement="top">
      <n-grid :cols="1" :y-gap="24">
        <!-- 四维等级 -->
        <n-gi>
          <n-card title="四维等级 (1-18)" size="small">
            <n-grid :cols="24" :x-gap="24" :y-gap="12" responsive="screen">
              <n-form-item-gi :span="6" label="体力等级">
                <n-input-number v-model:value="status.levelPhysical" :min="1" :max="18" />
              </n-form-item-gi>
              <n-form-item-gi :span="6" label="智力等级">
                <n-input-number v-model:value="status.levelIntelligence" :min="1" :max="18" />
              </n-form-item-gi>
              <n-form-item-gi :span="6" label="魅力等级">
                <n-input-number v-model:value="status.levelCharm" :min="1" :max="18" />
              </n-form-item-gi>
              <n-form-item-gi :span="6" label="感性等级">
                <n-input-number v-model:value="status.levelSense" :min="1" :max="18" />
              </n-form-item-gi>
            </n-grid>
          </n-card>
        </n-gi>

        <!-- 体力属性 -->
        <n-gi>
          <n-card title="体力属性" size="small">
            <n-grid :cols="24" :x-gap="24" :y-gap="12" responsive="screen">
              <n-form-item-gi :span="8" label="体力经验">
                <n-input-number v-model:value="status.valuePhysical" :min="0" />
              </n-form-item-gi>
              <n-form-item-gi :span="4" label="力量">
                <n-input-number v-model:value="status.phyKinryoku" :min="0" :max="9999" />
              </n-form-item-gi>
              <n-form-item-gi :span="4" label="生命">
                <n-input-number v-model:value="status.phySeimei" :min="0" :max="9999" />
              </n-form-item-gi>
              <n-form-item-gi :span="4" label="精神">
                <n-input-number v-model:value="status.phyKonjyo" :min="0" :max="9999" />
              </n-form-item-gi>
              <n-form-item-gi :span="4" label="敏捷">
                <n-input-number v-model:value="status.phyBinsho" :min="0" :max="9999" />
              </n-form-item-gi>
            </n-grid>
          </n-card>
        </n-gi>

        <!-- 智力属性 -->
        <n-gi>
          <n-card title="智力属性" size="small">
            <n-grid :cols="24" :x-gap="24" :y-gap="12" responsive="screen">
              <n-form-item-gi :span="8" label="智力经验">
                <n-input-number v-model:value="status.valueIntelligence" :min="0" />
              </n-form-item-gi>
              <n-form-item-gi :span="4" label="文学">
                <n-input-number v-model:value="status.intBungaku" :min="0" :max="9999" />
              </n-form-item-gi>
              <n-form-item-gi :span="4" label="算术">
                <n-input-number v-model:value="status.intSanjyutsu" :min="0" :max="9999" />
              </n-form-item-gi>
              <n-form-item-gi :span="4" label="魔法">
                <n-input-number v-model:value="status.intMajyutsu" :min="0" :max="9999" />
              </n-form-item-gi>
              <n-form-item-gi :span="4" label="信仰">
                <n-input-number v-model:value="status.intShinkou" :min="0" :max="9999" />
              </n-form-item-gi>
            </n-grid>
          </n-card>
        </n-gi>

        <!-- 魅力属性 -->
        <n-gi>
          <n-card title="魅力属性" size="small">
            <n-grid :cols="24" :x-gap="24" :y-gap="12" responsive="screen">
              <n-form-item-gi :span="8" label="魅力经验">
                <n-input-number v-model:value="status.valueCharm" :min="0" />
              </n-form-item-gi>
              <n-form-item-gi :span="4" label="美貌">
                <n-input-number v-model:value="status.chaBibou" :min="0" :max="9999" />
              </n-form-item-gi>
              <n-form-item-gi :span="4" label="社交">
                <n-input-number v-model:value="status.chaShakou" :min="0" :max="9999" />
              </n-form-item-gi>
              <n-form-item-gi :span="4" label="礼仪">
                <n-input-number v-model:value="status.chaReigi" :min="0" :max="9999" />
              </n-form-item-gi>
              <n-form-item-gi :span="4" label="道德">
                <n-input-number v-model:value="status.chaDoutoku" :min="0" :max="9999" />
              </n-form-item-gi>
            </n-grid>
          </n-card>
        </n-gi>

        <!-- 感性属性 -->
        <n-gi>
          <n-card title="感性属性" size="small">
            <n-grid :cols="24" :x-gap="24" :y-gap="12" responsive="screen">
              <n-form-item-gi :span="8" label="感性经验">
                <n-input-number v-model:value="status.valueSense" :min="0" />
              </n-form-item-gi>
              <n-form-item-gi :span="4" label="创造">
                <n-input-number v-model:value="status.senSouzou" :min="0" :max="9999" />
              </n-form-item-gi>
              <n-form-item-gi :span="4" label="创作">
                <n-input-number v-model:value="status.senSousaku" :min="0" :max="9999" />
              </n-form-item-gi>
              <n-form-item-gi :span="4" label="直感">
                <n-input-number v-model:value="status.senOnkan" :min="0" :max="9999" />
              </n-form-item-gi>
              <n-form-item-gi :span="4" label="美感">
                <n-input-number v-model:value="status.senBikan" :min="0" :max="9999" />
              </n-form-item-gi>
            </n-grid>
          </n-card>
        </n-gi>

        <!-- 战斗属性 -->
        <n-gi>
          <n-card title="战斗属性" size="small">
            <n-grid :cols="24" :x-gap="24" :y-gap="12" responsive="screen">
              <n-form-item-gi :span="6" label="战斗等级">
                <n-input-number v-model:value="status.levelBattle" :min="1" :max="18" />
              </n-form-item-gi>
              <n-form-item-gi :span="6" label="技能等级">
                <n-input-number v-model:value="status.levelArts" :min="1" :max="18" />
              </n-form-item-gi>
              <n-form-item-gi :span="6" label="魔法等级">
                <n-input-number v-model:value="status.levelMagic" :min="1" :max="18" />
              </n-form-item-gi>
              <n-form-item-gi :span="6" label="战斗经验">
                <n-input-number v-model:value="status.btlExp" :min="0" :max="99999" />
              </n-form-item-gi>
            </n-grid>
          </n-card>
        </n-gi>
      </n-grid>
    </n-form>
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
.editor-section {
  max-width: 1200px;
}
.section-title {
  margin-bottom: 1.5rem;
  color: #0EA5E9;
  border-bottom: 2px solid #0EA5E9;
  padding-bottom: 0.5rem;
}
</style>