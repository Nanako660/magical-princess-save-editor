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
    
    <n-grid :cols="24" :x-gap="24" :y-gap="24" responsive="screen">
      <n-gi :span="8">
        <n-card title="属性快捷" size="small">
          <n-space vertical>
            <n-button block @click="confirmAction('maxAllStats')" type="warning" ghost>一键满属性</n-button>
            <n-button block @click="confirmAction('maxMoney')" type="warning" ghost>金钱最大化</n-button>
            <n-button block @click="confirmAction('clearStress')" type="warning" ghost>压力清零</n-button>
            <n-button block @click="confirmAction('maxActionPower')" type="warning" ghost>行动力全满</n-button>
            <n-button block @click="confirmAction('maxBlackCoin')" type="warning" ghost>东亚硬币最大化</n-button>
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
import { NGrid, NGi, NCard, NSpace, NButton, NAlert, NModal, NText, NIcon } from 'naive-ui'
import { HelpCircleOutline, WarningOutline } from '@vicons/ionicons5'

export default {
  name: 'QuickActions',
  components: { NGrid, NGi, NCard, NSpace, NButton, NAlert, NModal, NText, NIcon, HelpCircleOutline, WarningOutline },
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
.section-title {
  margin-bottom: 1.5rem;
  color: #667eea;
  border-bottom: 2px solid #667eea;
  padding-bottom: 0.5rem;
}
.subsection-title {
  margin-bottom: 1rem;
  color: #888;
  font-size: 1rem;
  font-weight: 500;
}
</style>
