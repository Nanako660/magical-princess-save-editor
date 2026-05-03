<template>
  <section class="editor-section">
    <h2 class="section-title">首页</h2>
    
    <n-alert title="使用说明" type="success" style="margin-bottom: 24px;">
      <template #icon>
        <n-icon><HelpCircleOutline /></n-icon>
      </template>
      <n-space vertical :size="12">
        <div>
          <n-text depth="2" strong>基本操作：</n-text>
          <n-text depth="3">点击顶部目录按钮选择存档文件，修改后点击应用编辑按钮保存更改。</n-text>
        </div>
        <div>
          <n-text depth="2" strong>修改时机：</n-text>
          <n-text depth="3">可在游戏运行过程中在主菜单修改存档，修改完成后重新加载存档生效。但建议退出游戏修改，修改完成后重新启动游戏。</n-text>
        </div>
        <div>
          <n-text depth="2" strong>功能模块：</n-text>
          <n-text depth="3">左侧菜单提供基础属性、详细属性、装备、NPC、物品、技能、轮回数据等编辑功能。</n-text>
        </div>
      </n-space>
    </n-alert>
    
    <n-alert title="警告" type="error" style="margin-bottom: 24px;">
      <template #icon>
        <n-icon><WarningOutline /></n-icon>
      </template>
      存档修改操作不可逆！强烈建议在修改前备份原始存档文件。错误的数据可能导致游戏无法正常读取存档。
    </n-alert>
    
    <h3 class="subsection-title">快捷操作</h3>
    <n-alert
      v-if="disabled"
      type="info"
      style="margin-bottom: 16px;"
    >
      先从顶栏选择一个存档后才能使用快捷操作。
    </n-alert>

    <div class="quick-actions-columns">
      <n-card size="small" class="quick-actions-panel">
        <div class="quick-actions-stack">
          <section class="quick-action-group">
            <h4 class="quick-action-group__title">属性快捷</h4>
            <n-grid :cols="2" :x-gap="6" :y-gap="6" class="quick-action-buttons">
              <n-gi><n-button class="quick-action-button" :disabled="disabled" @click="confirmAction('maxAllStats')" type="warning" ghost>一键满属性</n-button></n-gi>
              <n-gi><n-button class="quick-action-button" :disabled="disabled" @click="confirmAction('maxMoney')" type="warning" ghost>金钱最大化</n-button></n-gi>
              <n-gi><n-button class="quick-action-button" :disabled="disabled" @click="confirmAction('clearStress')" type="warning" ghost>压力清零</n-button></n-gi>
              <n-gi><n-button class="quick-action-button" :disabled="disabled" @click="confirmAction('maxActionPower')" type="warning" ghost>行动力全满</n-button></n-gi>
              <n-gi span="2"><n-button class="quick-action-button" :disabled="disabled" @click="confirmAction('maxBlackCoin')" type="warning" ghost>东亚硬币最大化</n-button></n-gi>
            </n-grid>
          </section>

          <section class="quick-action-group">
            <h4 class="quick-action-group__title">善恶快捷</h4>
            <n-grid :cols="2" :x-gap="6" :y-gap="6" class="quick-action-buttons">
              <n-gi><n-button class="quick-action-button" :disabled="disabled" @click="confirmAction('maxGoodAction')" type="warning" ghost>善行最大化</n-button></n-gi>
              <n-gi><n-button class="quick-action-button" :disabled="disabled" @click="confirmAction('maxBadAction')" type="warning" ghost>恶行最大化</n-button></n-gi>
            </n-grid>
          </section>
        </div>
      </n-card>

      <n-card size="small" class="quick-actions-panel">
        <div class="quick-actions-stack">
          <section class="quick-action-group">
            <h4 class="quick-action-group__title">时间快捷</h4>
            <n-grid :cols="2" :x-gap="6" :y-gap="6" class="quick-action-buttons">
              <n-gi><n-button class="quick-action-button" :disabled="disabled" @click="confirmAction('setMonth42')" type="warning" ghost>跳到最终月</n-button></n-gi>
              <n-gi><n-button class="quick-action-button" :disabled="disabled" @click="confirmAction('resetToMonth0')" type="warning" ghost>重置到初始月</n-button></n-gi>
            </n-grid>
          </section>

          <div class="quick-action-inline-groups">
            <section class="quick-action-group">
              <h4 class="quick-action-group__title">NPC快捷</h4>
              <n-grid :cols="2" :x-gap="6" :y-gap="6" class="quick-action-buttons">
                <n-gi span="2"><n-button class="quick-action-button" :disabled="disabled" @click="confirmAction('maxAllFavorability')" type="warning" ghost>全NPC满好感</n-button></n-gi>
              </n-grid>
            </section>

            <section class="quick-action-group">
              <h4 class="quick-action-group__title">技能快捷</h4>
              <n-grid :cols="2" :x-gap="6" :y-gap="6" class="quick-action-buttons">
                <n-gi span="2"><n-button class="quick-action-button" :disabled="disabled" @click="confirmAction('unlockAllSkills')" type="warning" ghost>解锁全部技能</n-button></n-gi>
              </n-grid>
            </section>
          </div>
        </div>
      </n-card>
    </div>

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
import { NGrid, NGi, NCard, NButton, NAlert, NModal, NText, NIcon, NSpace } from 'naive-ui'
import { HelpCircleOutline, WarningOutline } from '@vicons/ionicons5'

export default {
  name: 'QuickActions',
  components: { NGrid, NGi, NCard, NButton, NAlert, NModal, NText, NIcon, NSpace, HelpCircleOutline, WarningOutline },
  props: {
    disabled: { type: Boolean, default: false }
  },
  emits: ['execute', 'query'],
  setup(props, { emit }) {
    const showModal = ref(false)
    const pendingAction = ref(null)

    const confirmAction = (action) => {
      if (props.disabled) return
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
.subsection-title {
  margin-bottom: 1rem;
  color: #888;
  font-size: 1rem;
  font-weight: 500;
}

.quick-actions-columns {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 24px;
  align-items: start;
}

.quick-actions-panel {
  margin-top: 0 !important;
}

.quick-actions-panel :deep(.n-card__content) {
  padding: 20px 22px 22px;
  box-sizing: border-box;
}

.quick-actions-stack {
  display: flex;
  flex-direction: column;
  gap: 22px;
}

.quick-action-inline-groups {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 16px;
  align-items: start;
}

.quick-action-group {
  min-width: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.quick-action-group__title {
  margin: 0 0 10px;
  color: #d4d4d8;
  font-size: 0.95rem;
  font-weight: 600;
  line-height: 1.2;
  width: fit-content;
  max-width: 100%;
  align-self: center;
}

.quick-action-buttons {
  width: fit-content;
  max-width: 100%;
  min-width: 0;
  margin: 0 auto;
}

.quick-action-buttons :deep(.n-grid-item) {
  display: flex;
  justify-content: center;
}

.quick-action-button {
  width: 100%;
  max-width: 240px;
}

.quick-action-buttons :deep(.n-button) {
  white-space: nowrap;
}
</style>
