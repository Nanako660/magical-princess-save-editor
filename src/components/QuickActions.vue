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
            <n-button block @click="confirmAction('maxAllStats')" type="warning" ghost>一键满属性</n-button>
            <n-button block @click="confirmAction('maxMoney')" type="warning" ghost>金钱最大化</n-button>
            <n-button block @click="confirmAction('clearStress')" type="warning" ghost>压力清零</n-button>
            <n-button block @click="confirmAction('maxActionPower')" type="warning" ghost>行动力全满</n-button>
            <n-button block @click="confirmAction('maxBlackCoin')" type="warning" ghost>黑币最大化</n-button>
          </n-space>
        </n-card>
      </n-gi>

      <n-gi :span="8">
        <n-card title="善恶快捷" size="small">
          <n-space vertical>
            <n-button block @click="confirmAction('maxGoodAction')" type="warning" ghost>善行最大化</n-button>
            <n-button block @click="confirmAction('maxBadAction')" type="warning" ghost>恶行最大化</n-button>
          </n-space>
        </n-card>
      </n-gi>

      <n-gi :span="8">
        <n-card title="NPC快捷" size="small">
          <n-space vertical>
            <n-button block @click="confirmAction('maxAllFavorability')" type="warning" ghost>全NPC满好感</n-button>
          </n-space>
        </n-card>
      </n-gi>

      <n-gi :span="8">
        <n-card title="技能快捷" size="small">
          <n-space vertical>
            <n-button block @click="confirmAction('unlockAllSkills')" type="warning" ghost>解锁全部技能</n-button>
          </n-space>
        </n-card>
      </n-gi>

      <n-gi :span="8">
        <n-card title="时间快捷" size="small">
          <n-space vertical>
            <n-button block @click="confirmAction('setMonth42')" type="warning" ghost>跳到最终月</n-button>
            <n-button block @click="confirmAction('resetToMonth0')" type="warning" ghost>重置到初始月</n-button>
          </n-space>
        </n-card>
      </n-gi>
    </n-grid>

    <n-modal v-model:show="showModal" preset="dialog" type="warning"
      :title="'确认：' + (pendingAction?.label || '')"
    >
      <div v-if="pendingAction">
        <p style="margin: 0 0 8px; color: #ccc;">将执行以下变更：</p>
        <ul style="margin: 0; padding-left: 20px;">
          <li v-for="(f, i) in pendingAction.fields" :key="i" style="color: #e2e8f0; line-height: 1.8;">
            {{ f }}
          </li>
        </ul>
      </div>
      <template #action>
        <n-button type="warning" @click="handleConfirm">确认执行</n-button>
        <n-button @click="showModal = false">取消</n-button>
      </template>
    </n-modal>
  </section>
</template>

<script>
import { ref } from 'vue'
import { NGrid, NGi, NCard, NSpace, NButton, NAlert, NModal } from 'naive-ui'

export default {
  name: 'QuickActions',
  components: { NGrid, NGi, NCard, NSpace, NButton, NAlert, NModal },
  emits: ['execute'],
  setup(props, { emit }) {
    const showModal = ref(false)
    const pendingAction = ref(null)

    const confirmAction = (action) => {
      emit('query', action, (info) => {
        if (info) {
          pendingAction.value = { action, ...info }
          showModal.value = true
        }
      })
    }

    const handleConfirm = () => {
      if (pendingAction.value) {
        emit('execute', pendingAction.value.action)
        pendingAction.value = null
        showModal.value = false
      }
    }

    return { showModal, pendingAction, confirmAction, handleConfirm }
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
