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

            <n-button v-if="showApplyButton" quaternary type="success" @click="openSaveModal">
              <template #icon><n-icon><SaveOutline /></n-icon></template>
              应用编辑
            </n-button>

            <n-popconfirm 
              class="header-reset-popconfirm"
              positive-text="确认"
              negative-text="取消"
              @positive-click="handleReset"
            >
              <template #trigger>
                <n-button quaternary type="error" size="small">
                  <template #icon><n-icon><RefreshOutline /></n-icon></template>
                  重置
                </n-button>
              </template>
              确定重置目录配置？将清除已保存的存档目录。
            </n-popconfirm>
          </div>
        </div>
      </n-layout-header>

      <!-- 未配置目录：引导页 -->
      <div v-if="!dirReady" class="setup-wrapper">
        <SetupGuide :loading="isLoading" @pick-dir="handlePickDir" />
      </div>

      <!-- 已配置目录：主界面 -->
      <template v-else>
        <n-layout has-sider position="absolute" style="top: 72px; bottom: 36px;">
          <n-layout-sider
            bordered
            collapse-mode="width"
            :collapsed-width="64"
            :width="180"
            class="app-sider"
          >
            <Sidebar
              :active-tab="activeTab"
              @update:active-tab="handleTabChange"
            />
          </n-layout-sider>

          <n-layout-content
            class="app-content"
            :native-scrollbar="false"
            content-style="min-height: 100%; box-sizing: border-box;"
          >
            <div class="content-shell" :class="{ 'content-shell--wide': isWideTab }">
              <section v-if="showPreSaveEmptyState" class="editor-section">
                <div class="empty-state empty-state--embedded">
                  <n-empty description="从顶栏选择一个存档开始编辑">
                    <template #extra>
                      <n-text depth="3" style="font-size: 0.85rem;">
                        点击上方「{{ dirName }}」按钮展开存档列表
                      </n-text>
                    </template>
                  </n-empty>
                </div>
              </section>
              <transition name="tab-loading-fade">
                <div v-if="isTabSwitching" class="tab-switch-overlay">
                  <div class="tab-switch-loader">
                    <div class="tab-switch-loader__bar">
                      <span class="tab-switch-loader__bar-fill"></span>
                    </div>
                    <div class="tab-switch-loader__text">页面切换中...</div>
                    <div class="tab-switch-loader__skeleton">
                      <n-skeleton text :repeat="5" />
                    </div>
                  </div>
                </div>
              </transition>
              <transition name="tab-content-fade" mode="out-in">
                <section v-if="!showPreSaveEmptyState && showSettingsStatusView" :key="`${renderedTab}-status`" class="editor-section settings-status-section">
                  <h2 class="section-title">{{ currentSettingsStatus.title }}</h2>
                  <n-card size="small" class="settings-status-card">
                    <n-alert
                      :type="currentSettingsStatus.state === 'missing' ? 'warning' : 'error'"
                      :title="currentSettingsStatus.state === 'missing' ? '未找到设置文件' : '设置文件加载失败'"
                      class="settings-status-alert"
                    >
                      {{ currentSettingsStatus.message }}
                    </n-alert>
                  </n-card>
                </section>
                <keep-alive v-else-if="!showPreSaveEmptyState">
                  <component
                    :is="currentTabComponent"
                    v-if="currentTabComponent"
                    :key="renderedTab"
                    v-bind="currentTabProps"
                    v-on="currentTabListeners"
                  />
                </keep-alive>
              </transition>
            </div>
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
      <p style="color: #ccc;">{{ saveModalText }}</p>
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
  NButton, NIcon, NText, NPopover, NScrollbar, NEmpty, NPopconfirm, NModal, NSkeleton, NCard, NAlert,
  darkTheme, createDiscreteApi
} from 'naive-ui'
import { FolderOpenOutline, SaveOutline, RefreshOutline } from '@vicons/ionicons5'
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
import ConfigEditor from './components/ConfigEditor.vue'
import BattleArtsEditor from './components/BattleArtsEditor.vue'
import ActivityEditor from './components/ActivityEditor.vue'
import CurriculumEditor from './components/CurriculumEditor.vue'

export default {
  name: 'App',

  components: {
    NConfigProvider, NGlobalStyle, NLayout, NLayoutHeader, NLayoutSider, NLayoutContent, NLayoutFooter,
    NButton, NIcon, NText, NPopover, NScrollbar, NEmpty, NPopconfirm, NModal, NSkeleton, NCard, NAlert,
    FolderOpenOutline, SaveOutline, RefreshOutline,
    SetupGuide, Sidebar, BasicEditor, DetailedEditor, EquipmentEditor,
    FriendEditor, ItemEditor, SkillEditor, GlobalEditor, QuickActions,
    ConfigEditor, BattleArtsEditor, ActivityEditor, CurriculumEditor
  },

  setup() {
    const { message } = createDiscreteApi(['message'], {
      configProviderProps: { theme: darkTheme }
    })

    const {
      saveData, isLoading, fileName, error,
      dirReady, dirName, saveSlots,
      configData,
      configLoadState,
      configLoadMessage,
      pickDir, loadSlot, downloadSave,
      loadConfigData,
      downloadConfig,
      getMonthText, hasData, resetDir
    } = useSaveData()

    const { getActionInfo, executeAction } = useQuickActions(saveData)

    const activeTab = ref('quick')
    const renderedTab = ref('quick')
    const isTabSwitching = ref(false)
    const isSaving = ref(false)
    const slotPopoverShow = ref(false)
    const showSaveModal = ref(false)
    const wideTabs = new Set(['items', 'skills', 'battlearts', 'activity', 'curriculum'])
    let switchFrameId = null

    const clearPendingTabSwitch = () => {
      if (switchFrameId !== null) {
        cancelAnimationFrame(switchFrameId)
        switchFrameId = null
      }
    }

    const completeTabSwitch = (tab) => {
      renderedTab.value = tab
      isTabSwitching.value = false
    }

    const ensureTabDataLoaded = async (tab) => {
      if (tab === 'config') {
        if (configData.value || configLoadState.value === 'ready') return true
        return await loadConfigData()
      }
      return true
    }

    const handleTabChange = async (tab) => {
      if (tab === activeTab.value) return
      activeTab.value = tab
      clearPendingTabSwitch()
      isTabSwitching.value = true
      await ensureTabDataLoaded(tab)
      switchFrameId = requestAnimationFrame(() => {
        switchFrameId = requestAnimationFrame(() => {
          completeTabSwitch(tab)
          switchFrameId = null
        })
      })
    }

    const currentTabComponent = computed(() => {
      if (!hasData.value && !['quick', 'config'].includes(renderedTab.value)) return null
      if (renderedTab.value === 'config' && configLoadState.value !== 'ready') return null
      return {
        quick: QuickActions,
        basic: BasicEditor,
        detailed: DetailedEditor,
        equipment: EquipmentEditor,
        npc: FriendEditor,
        items: ItemEditor,
        skills: SkillEditor,
        global: GlobalEditor,
        battlearts: BattleArtsEditor,
        activity: ActivityEditor,
        curriculum: CurriculumEditor,
        config: ConfigEditor
      }[renderedTab.value] || null
    })

    const currentSettingsStatus = computed(() => {
      if (renderedTab.value === 'config') {
        return {
          title: '用户设置',
          state: configLoadState.value,
          message: configLoadMessage.value || '用户设置暂时不可用。'
        }
      }
      return null
    })

    const showSettingsStatusView = computed(() => (
      !!currentSettingsStatus.value
      && currentSettingsStatus.value.state !== 'ready'
      && !isTabSwitching.value
    ))

    const currentTabProps = computed(() => {
      if (renderedTab.value === 'config') {
        return configData.value ? { config: configData.value } : {}
      }
      if (renderedTab.value === 'quick') {
        return { disabled: !hasData.value }
      }
      if (!saveData.value) return {}
      return {
        basic: { status: saveData.value.status },
        detailed: { status: saveData.value.status },
        equipment: { status: saveData.value.status, itemList: saveData.value.itemDataParamList },
        npc: { friendList: saveData.value.friendDataParamList },
        items: { itemList: saveData.value.itemDataParamList },
        skills: { skillList: saveData.value.skillDataParamList },
        global: { gstatus: saveData.value.gstatus },
        battlearts: { artsList: saveData.value.battleArtsDataParamList },
        activity: { activityList: saveData.value.activityDataParamList },
        curriculum: { curriculumList: saveData.value.curriculumDataParamList }
      }[renderedTab.value] || {}
    })

    const currentTabListeners = computed(() => ({
      quick: {
        execute: handleQuickAction,
        query: handleQuery
      },
      items: {
        'update:item-list': ($event) => { saveData.value.itemDataParamList = $event }
      },
      skills: {
        'update:skill-list': ($event) => { saveData.value.skillDataParamList = $event }
      },
      battlearts: {
        'update:arts-list': ($event) => { saveData.value.battleArtsDataParamList = $event }
      },
      activity: {
        'update:activity-list': ($event) => { saveData.value.activityDataParamList = $event }
      },
      curriculum: {
        'update:curriculum-list': ($event) => { saveData.value.curriculumDataParamList = $event }
      }
    }[renderedTab.value] || {}))

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
    const isWideTab = computed(() => wideTabs.has(activeTab.value))
    const showPreSaveEmptyState = computed(() => dirReady.value && !hasData.value && !['quick', 'config'].includes(activeTab.value))
    const showApplyButton = computed(() => dirReady.value && (hasData.value || configLoadState.value === 'ready'))
    const saveModalText = computed(() => {
      if (hasData.value && fileName.value) {
        return `确定要将当前修改应用到 ${fileName.value}，并同步保存用户设置吗？`
      }
      return '确定要应用当前用户设置修改吗？'
    })

    const handlePickDir = async () => {
      const ok = await pickDir()
      if (ok) message.success('存档目录已设置')
    }

    const handleLoadSlot = async (slot) => {
      slotPopoverShow.value = false
      await loadSlot(slot)
      if (!error.value && hasData.value) {
        if (activeTab.value !== 'config') {
          activeTab.value = 'quick'
          renderedTab.value = 'quick'
        }
        isTabSwitching.value = false
        message.success(`已加载 ${slot.name}`)
      } else if (error.value) {
        message.error(`加载失败: ${error.value}`)
      }
    }

    const openSaveModal = () => {
      if (!showApplyButton.value) return
      showSaveModal.value = true
    }

    const handleSave = async () => {
      isSaving.value = true
      let saveOk = true
      let configOk = true

      if (hasData.value) {
        saveOk = await downloadSave()
      }

      if (configLoadState.value === 'ready' && configData.value) {
        configOk = await downloadConfig()
      }

      isSaving.value = false
      if (saveOk && configOk) {
        showSaveModal.value = false
        message.success(hasData.value ? '修改已应用' : '用户设置已保存')
      } else {
        message.error(error.value || '应用失败')
      }
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
      saveData, isLoading, fileName, activeTab, renderedTab, hasData, footerText, isWideTab,
      dirReady, dirName, saveSlots, slotPopoverShow, isSaving,
      showPreSaveEmptyState, showApplyButton, saveModalText,
      showSaveModal, isTabSwitching, currentTabComponent, currentTabProps, currentTabListeners,
      currentSettingsStatus, showSettingsStatusView,
      configData,
      configLoadState, configLoadMessage,
      handlePickDir, handleLoadSlot, openSaveModal, handleSave,
      handleQuery, handleQuickAction, handleReset, formatSize, handleTabChange
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

.app-content {
  --page-max-width: 1280px;
  --page-max-width-wide: 1360px;
  --page-gutter: 24px;
}

.content-shell {
  position: relative;
  width: min(var(--page-max-width), calc(100% - (var(--page-gutter) * 2)));
  min-height: 100%;
  margin: 0 auto;
  padding: 24px 0 32px;
  box-sizing: border-box;
}

.content-shell--wide {
  width: min(var(--page-max-width-wide), calc(100% - (var(--page-gutter) * 2)));
  height: 100%;
  padding-bottom: 24px;
  overflow: hidden;
}

.editor-section {
  width: 100%;
  min-width: 0;
  box-sizing: border-box;
}

.card-grid {
  display: grid;
  grid-template-columns: repeat(12, minmax(0, 1fr));
  gap: 24px;
  align-items: start;
}

.card-grid-item {
  min-width: 0;
}

.card-grid-item--full {
  grid-column: span 12;
}

.card-grid-item--wide {
  grid-column: span 8;
}

.card-grid-item--half {
  grid-column: span 6;
}

.card-grid-item--third {
  grid-column: span 4;
}

.card-grid-item--quarter {
  grid-column: span 3;
}

.card-grid-item .n-card,
.card-grid-item > .n-card {
  height: 100%;
}

.card-grid-item .n-form,
.card-grid-item .n-grid {
  min-width: 0;
}

.section-title {
  margin: 0 0 1.5rem;
  color: #667eea;
  border-bottom: 2px solid #667eea;
  padding-bottom: 0.5rem;
}

.page-table .list-controls {
  margin-bottom: 12px;
}

.page-table {
  height: 100%;
  min-height: 0;
  display: flex;
  flex-direction: column;
}

.page-table .n-card:last-child,
.page-table .table-panel {
  flex: 1;
  min-height: 0;
}

.page-table .table-scroll-shell {
  height: 100%;
  min-height: 0;
}

.page-table .n-card__content {
  min-height: 0;
}

.content-shell .n-card + .n-card,
.content-shell .npc-group + .npc-group,
.content-shell .item-group + .item-group {
  margin-top: 24px;
}

.content-shell .n-form {
  margin: 0;
  padding: 0;
}

.content-shell .n-grid,
.content-shell .n-space {
  width: 100%;
}

.content-shell .n-space {
  flex-wrap: wrap;
}

.content-shell .n-form-item {
  min-width: 0;
}

.content-shell .n-input-number,
.content-shell .n-select,
.content-shell .n-slider {
  width: 100%;
}

.content-shell .n-input-group .n-input-number {
  width: auto;
}

.content-shell .n-table-wrapper,
.content-shell .n-table,
.content-shell .n-data-table-wrapper,
.content-shell .n-data-table {
  width: 100%;
}

.content-shell .n-alert {
  width: 100%;
}

.page-table .n-table {
  table-layout: fixed;
}

.page-table .n-table th,
.page-table .n-table td {
  white-space: normal;
  word-break: break-word;
}

.tab-switch-overlay {
  position: absolute;
  inset: 24px 0 24px;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding-top: 8px;
  pointer-events: none;
  z-index: 2;
}

.tab-switch-loader {
  width: min(520px, calc(100% - 32px));
  padding: 18px 20px 16px;
  border: 1px solid rgba(94, 234, 212, 0.2);
  border-radius: 16px;
  background:
    linear-gradient(180deg, rgba(15, 23, 42, 0.94) 0%, rgba(15, 23, 42, 0.88) 100%);
  box-shadow:
    0 18px 48px rgba(2, 6, 23, 0.4),
    0 0 0 1px rgba(14, 165, 233, 0.08) inset;
  backdrop-filter: blur(10px);
}

.tab-switch-loader__bar {
  height: 4px;
  overflow: hidden;
  border-radius: 999px;
  background: rgba(148, 163, 184, 0.18);
}

.tab-switch-loader__bar-fill {
  display: block;
  width: 38%;
  height: 100%;
  border-radius: inherit;
  background: linear-gradient(90deg, #5eead4 0%, #0ea5e9 100%);
  animation: tabSwitchBar 1s ease-in-out infinite;
}

.tab-switch-loader__text {
  margin: 12px 0 14px;
  color: #cbd5e1;
  font-size: 0.95rem;
  letter-spacing: 0.02em;
}

.tab-switch-loader__skeleton {
  opacity: 0.82;
}

.settings-status-card {
  max-width: 760px;
}

.settings-status-alert {
  width: 100%;
}

.header-reset-popconfirm .n-popconfirm__action {
  display: flex;
  flex-direction: row-reverse;
  justify-content: flex-start;
  gap: 8px;
}

.header-reset-popconfirm .n-popconfirm__action .n-button {
  margin: 0;
}

.tab-loading-fade-enter-active,
.tab-loading-fade-leave-active,
.tab-content-fade-enter-active,
.tab-content-fade-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}

.tab-loading-fade-enter-from,
.tab-loading-fade-leave-to,
.tab-content-fade-enter-from,
.tab-content-fade-leave-to {
  opacity: 0;
}

.tab-loading-fade-enter-from,
.tab-content-fade-enter-from {
  transform: translateY(6px);
}

.tab-loading-fade-leave-to,
.tab-content-fade-leave-to {
  transform: translateY(-4px);
}

@keyframes tabSwitchBar {
  0% {
    transform: translateX(-120%);
  }
  100% {
    transform: translateX(320%);
  }
}

@media (max-width: 900px) {
  .app-content {
    --page-gutter: 16px;
  }

  .content-shell {
    padding-top: 20px;
  }

  .card-grid {
    gap: 20px;
  }

  .card-grid-item--wide,
  .card-grid-item--half,
  .card-grid-item--third {
    grid-column: span 6;
  }
}

@media (max-width: 640px) {
  .app-content {
    --page-gutter: 12px;
  }

  .card-grid {
    gap: 16px;
  }

  .card-grid-item--wide,
  .card-grid-item--half,
  .card-grid-item--third,
  .card-grid-item--full {
    grid-column: span 12;
  }
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

.empty-state--embedded {
  min-height: calc(100vh - 72px - 36px - 48px);
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
