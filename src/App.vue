<template>
  <n-config-provider :theme="darkTheme">
    <n-global-style />
    <n-layout position="absolute">
      <!-- 顶栏 -->
      <n-layout-header bordered class="app-header">
        <div class="header-inner">
          <div class="header-left">
            <h1><img :src="logoSrc" alt="Magical Princess" class="header-logo" /> <span class="header-title">存档编辑器</span></h1>
            
            <n-popover v-if="dirReady" trigger="click" placement="bottom-start" :show="slotPopoverShow" @update:show="slotPopoverShow = $event">
              <template #trigger>
                <n-button quaternary type="info" @click="slotPopoverShow = !slotPopoverShow">
                  <template #icon><n-icon><FolderOpenOutline /></n-icon></template>
                  {{ dirName }}
                  <n-text depth="3" style="margin-left: 4px;">({{ saveSlots.length }})</n-text>
                </n-button>
              </template>
              <n-scrollbar style="max-height: 320px">
                <div class="slot-list">
                  <div v-if="saveSlots.length === 0" class="slot-empty">目录中没有找到存档文件</div>
                  <div
                    v-for="slot in saveSlots"
                    :key="slot.slotId"
                    class="slot-item"
                    :class="{ active: fileName === slot.name }"
                    @click="handleLoadSlot(slot)"
                  >
                    <span class="slot-name">{{ slot.name }}</span>
                    <span class="slot-meta">槽位 {{ slot.slotId }} · {{ formatSize(slot.size) }}</span>
                  </div>
                </div>
              </n-scrollbar>
            </n-popover>
          </div>

          <div v-if="dirReady" class="header-actions">

            <n-button v-if="hasData" quaternary type="success" @click="openSaveModal">
              <template #icon><n-icon><SaveOutline /></n-icon></template>
              应用编辑
            </n-button>

            <n-popconfirm 
              @positive-click="handleReset"
            >
              <template #trigger>
                <n-button quaternary type="error" size="small">
                  <template #icon><n-icon><RefreshOutline /></n-icon></template>
                  重置
                </n-button>
              </template>
              确定重置目录配置？将清除已保存的存档目录。
              <template #action="{ handlePositiveClick, handleNegativeClick }">
                <n-button size="small" type="error" @click="handlePositiveClick">确认</n-button>
                <n-button size="small" @click="handleNegativeClick">取消</n-button>
              </template>
            </n-popconfirm>
          </div>
        </div>
      </n-layout-header>

      <!-- 未配置目录：引导页 -->
      <div v-if="!dirReady" class="setup-wrapper">
        <SetupGuide :loading="isLoading" @pick-dir="handlePickDir" />
      </div>

      <!-- 已配置目录但未加载存档：选择提示 -->
      <n-layout v-else-if="!hasData" position="absolute" style="top: 72px; bottom: 0;">
        <n-layout-content>
          <div class="empty-state">
            <n-empty description="从顶栏选择一个存档开始编辑">
              <template #extra>
                <n-text depth="3" style="font-size: 0.85rem;">
                  点击上方「{{ dirName }}」按钮展开存档列表
                </n-text>
              </template>
            </n-empty>
          </div>
        </n-layout-content>
      </n-layout>

      <!-- 已加载存档：编辑器 -->
      <template v-else>
        <n-layout has-sider position="absolute" style="top: 72px; bottom: 36px;">
          <n-layout-sider
            bordered
            collapse-mode="width"
            :collapsed-width="64"
            :width="180"
            class="app-sider"
          >
            <Sidebar v-model:active-tab="activeTab" :enabled="hasData" />
          </n-layout-sider>

          <n-layout-content
            class="app-content"
            :native-scrollbar="false"
            content-style="min-height: 100%; display: flex; flex-direction: column; align-items: center; padding: 24px; box-sizing: border-box;"
          >
            <BasicEditor v-if="activeTab === 'basic'" :status="saveData.status" />
            <DetailedEditor v-if="activeTab === 'detailed'" :status="saveData.status" />
            <EquipmentEditor v-if="activeTab === 'equipment'" :status="saveData.status" :item-list="saveData.itemDataParamList" />
            <FriendEditor v-if="activeTab === 'npc'" :friend-list="saveData.friendDataParamList" />
            <ItemEditor v-if="activeTab === 'items'" :item-list="saveData.itemDataParamList" @update:item-list="saveData.itemDataParamList = $event" />
            <SkillEditor v-if="activeTab === 'skills'" :skill-list="saveData.skillDataParamList" @update:skill-list="saveData.skillDataParamList = $event" />
            <GlobalEditor v-if="activeTab === 'global'" :gstatus="saveData.gstatus" />
            <QuickActions v-if="activeTab === 'quick'" @execute="handleQuickAction" @query="handleQuery" />
          </n-layout-content>
        </n-layout>

        <n-layout-footer bordered position="absolute" class="app-footer">
          <span class="footer-left">{{ footerText }}</span>
          <span class="footer-right">v{{ appVersion }}</span>
        </n-layout-footer>
      </template>
    </n-layout>

    <n-modal v-model:show="showSaveModal" preset="dialog" type="info"
      title="确认应用编辑"
      :loading="isSaving"
    >
      <p style="color: #ccc;">确定要将当前修改应用到 <strong>{{ fileName }}</strong> 吗？</p>
      <template #action>
        <n-button type="primary" :loading="isSaving" @click="handleSave">应用</n-button>
        <n-button @click="showSaveModal = false">取消</n-button>
      </template>
    </n-modal>
  </n-config-provider>
</template>

<script>
import { ref, computed } from 'vue'
import {
  NConfigProvider, NGlobalStyle, NLayout, NLayoutHeader, NLayoutSider, NLayoutContent, NLayoutFooter,
  NButton, NIcon, NText, NPopover, NScrollbar, NEmpty, NPopconfirm, NModal,
  darkTheme, createDiscreteApi
} from 'naive-ui'
import { FolderOpenOutline, SaveOutline, ArrowBackOutline, RefreshOutline } from '@vicons/ionicons5'
import { useSaveData } from './composables/useSaveData.js'
import { useQuickActions } from './composables/useQuickActions.js'
import logoSrc from './assets/logo.png'

import SetupGuide from './components/SetupGuide.vue'
import Sidebar from './components/Sidebar.vue'
import BasicEditor from './components/BasicEditor.vue'
import DetailedEditor from './components/DetailedEditor.vue'
import EquipmentEditor from './components/EquipmentEditor.vue'
import FriendEditor from './components/FriendEditor.vue'
import ItemEditor from './components/ItemEditor.vue'
import SkillEditor from './components/SkillEditor.vue'
import GlobalEditor from './components/GlobalEditor.vue'
import QuickActions from './components/QuickActions.vue'

export default {
  name: 'App',

  components: {
    NConfigProvider, NGlobalStyle, NLayout, NLayoutHeader, NLayoutSider, NLayoutContent, NLayoutFooter,
    NButton, NIcon, NText, NPopover, NScrollbar, NEmpty, NPopconfirm, NModal,
    FolderOpenOutline, SaveOutline, ArrowBackOutline, RefreshOutline,
    SetupGuide, Sidebar, BasicEditor, DetailedEditor, EquipmentEditor,
    FriendEditor, ItemEditor, SkillEditor, GlobalEditor, QuickActions
  },

  setup() {
    const { message } = createDiscreteApi(['message'], {
      configProviderProps: { theme: darkTheme }
    })

    const {
      saveData, isLoading, fileName, error,
      dirReady, dirName, saveSlots,
      pickDir, loadSlot, downloadSave,
      getMonthText, hasData, resetDir
    } = useSaveData()

    const { getActionInfo, executeAction } = useQuickActions(saveData)

    const activeTab = ref('quick')
    const isSaving = ref(false)
    const slotPopoverShow = ref(false)
    const showSaveModal = ref(false)

    const footerText = computed(() => {
      if (!saveData.value) return ''
      const slot = saveData.value.saveSlotId || 1
      const month = getMonthText(saveData.value.status?.period || 0)
      const money = saveData.value.status?.money || 0
      const stress = saveData.value.status?.stress || 0
      const activePower = saveData.value.status?.activePower || 0
      const activePowerMax = saveData.value.status?.activePowerMax || 0
      return `槽位: ${slot} | ${month} | 金钱: ${money} | 压力: ${stress} | 行动力: ${activePower}/${activePowerMax}`
    })

    const appVersion = __APP_VERSION__

    const handlePickDir = async () => {
      const ok = await pickDir()
      if (ok) message.success('存档目录已设置')
    }

    const handleLoadSlot = async (slot) => {
      slotPopoverShow.value = false
      await loadSlot(slot)
      if (!error.value && hasData.value) {
        activeTab.value = 'quick'
        message.success(`已加载 ${slot.name}`)
      } else if (error.value) {
        message.error(`加载失败: ${error.value}`)
      }
    }

    const openSaveModal = () => {
      showSaveModal.value = true
    }

    const handleSave = async () => {
      isSaving.value = true
      const ok = await downloadSave()
      isSaving.value = false
      if (ok) {
        showSaveModal.value = false
        message.success('存档已保存')
      } else {
        message.error(error.value || '保存失败')
      }
    }

    const handleBack = () => {
      saveData.value = null
      fileName.value = ''
    }

    const handleQuery = (action, cb) => {
      const info = getActionInfo(action)
      if (info) cb(info)
    }

    const handleQuickAction = (action) => {
      const result = executeAction(action)
      if (result) message.success(result.message)
    }

    const handleReset = async () => {
      await resetDir()
      message.success('目录配置已重置')
    }

    const formatSize = (bytes) => {
      if (bytes < 1024) return bytes + ' B'
      return (bytes / 1024).toFixed(1) + ' KB'
    }

    return {
      darkTheme, logoSrc, appVersion,
      saveData, isLoading, fileName, activeTab, hasData, footerText,
      dirReady, dirName, saveSlots, slotPopoverShow, isSaving,
      showSaveModal,
      handlePickDir, handleLoadSlot, openSaveModal, handleSave, handleBack,
      handleQuery, handleQuickAction, handleReset, formatSize
    }
  }
}
</script>

<style>
html, body, #app {
  height: 100%;
  margin: 0;
  padding: 0;
}

.app-header {
  height: 72px;
  box-sizing: border-box;
}

.header-inner {
  height: 100%;
  padding: 0 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 16px;
}

.app-header h1 {
  margin: 0;
  font-size: 1.5rem;
  font-weight: 600;
  white-space: nowrap;
  display: flex;
  align-items: center;
  gap: 12px;
}

.header-logo {
  height: calc(72px - 16px);
  width: auto;
  display: block;
}

.header-title {
  background: linear-gradient(180deg, #5EEAD4 0%, #0EA5E9 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  text-shadow: 0 0 20px rgba(94, 234, 212, 0.3);
  filter: drop-shadow(0 0 10px rgba(14, 165, 233, 0.2));
}

.header-actions {
  display: flex;
  gap: 8px;
  align-items: center;
}

.app-content :deep(.n-layout-scroll-container) {
  display: flex;
  flex-direction: column;
  padding: 24px;
  box-sizing: border-box;
}

.app-content :deep(.editor-section) {
  width: 100%;
  max-width: 1200px;
}

.app-footer {
  height: 36px;
  bottom: 0;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 0.85rem;
  color: #888;
  padding: 0 1rem;
  box-sizing: border-box;
}

.footer-left {
  flex: 1;
}

.footer-right {
  color: #666;
}

.slot-list {
  min-width: 260px;
}
.slot-empty {
  padding: 12px 4px;
  color: #999;
  font-size: 0.85rem;
  text-align: center;
}
.slot-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 10px;
  cursor: pointer;
  border-radius: 4px;
  gap: 12px;
  transition: background 0.15s;
}
.slot-item:hover {
  background: rgba(102, 126, 234, 0.15);
}
.slot-item.active {
  background: rgba(102, 126, 234, 0.25);
}
.slot-name {
  font-weight: 600;
  font-size: 0.9rem;
}
.slot-meta {
  font-size: 0.75rem;
  color: #888;
  white-space: nowrap;
}
.empty-state {
  display: flex;
  justify-content: center;
  align-items: center;
  height: calc(100vh - 72px);
}
.setup-wrapper {
  position: absolute;
  top: 72px;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
