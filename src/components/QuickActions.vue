<template>
  <section class="editor-section">
    <h2 class="section-title">快捷操作</h2>
    <n-alert title="警告" type="warning" style="margin-bottom: 24px;">
      以下操作会直接修改存档数据，请谨慎使用！
    </n-alert>
    
    <n-grid :cols="24" :x-gap="24" :y-gap="24" responsive="screen">
      <n-gi :span="8">
        <n-card title="属性快捷" size="small">
          <n-space vertical>
            <n-button block @click="handleAction('maxAllStats')" type="warning" ghost>一键满属性</n-button>
            <n-button block @click="handleAction('maxMoney')" type="warning" ghost>金钱最大化</n-button>
            <n-button block @click="handleAction('clearStress')" type="warning" ghost>压力清零</n-button>
            <n-button block @click="handleAction('maxActionPower')" type="warning" ghost>行动力全满</n-button>
            <n-button block @click="handleAction('maxBlackCoin')" type="warning" ghost>黑币最大化</n-button>
          </n-space>
        </n-card>
      </n-gi>

      <n-gi :span="8">
        <n-card title="善恶快捷" size="small">
          <n-space vertical>
            <n-button block @click="handleAction('maxGoodAction')" type="warning" ghost>善行最大化</n-button>
            <n-button block @click="handleAction('maxBadAction')" type="warning" ghost>恶行最大化</n-button>
          </n-space>
        </n-card>
      </n-gi>

      <n-gi :span="8">
        <n-card title="NPC快捷" size="small">
          <n-space vertical>
            <n-button block @click="handleAction('maxAllFavorability')" type="warning" ghost>全NPC满好感</n-button>
          </n-space>
        </n-card>
      </n-gi>

      <n-gi :span="8">
        <n-card title="技能快捷" size="small">
          <n-space vertical>
            <n-button block @click="handleAction('unlockAllSkills')" type="warning" ghost>解锁全部技能</n-button>
          </n-space>
        </n-card>
      </n-gi>

      <n-gi :span="8">
        <n-card title="时间快捷" size="small">
          <n-space vertical>
            <n-button block @click="handleAction('setMonth42')" type="warning" ghost>跳到最终月</n-button>
            <n-button block @click="handleAction('resetToMonth0')" type="warning" ghost>重置到初始月</n-button>
          </n-space>
        </n-card>
      </n-gi>
    </n-grid>
  </section>
</template>

<script>
import { NGrid, NGi, NCard, NSpace, NButton, NAlert } from 'naive-ui'

export default {
  name: 'QuickActions',
  components: { NGrid, NGi, NCard, NSpace, NButton, NAlert },
  emits: ['execute'],
  setup(props, { emit }) {
    const handleAction = (action) => {
      emit('execute', action)
    }
    return { handleAction }
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