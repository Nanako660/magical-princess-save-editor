<template>
  <n-config-provider :theme="darkTheme">
    <n-global-style />
    <n-layout position="absolute">
      <!-- 顶栏 -->
      <n-layout-header bordered class="app-header">
        <div class="header-inner">
          <h1>Magical Princess 存档编辑器</h1>
          <FileHandler
            :has-data="hasData"
            :is-loading="isLoading"
            :file-name="fileName"
            @import="handleImport"
            @export="handleExport"
          />
        </div>
      </n-layout-header>

      <!-- 有数据时显示主体内容 -->
      <n-layout has-sider position="absolute" style="top: 72px; bottom: 36px;" v-if="hasData">
        <n-layout-sider
          bordered
          collapse-mode="width"
          :collapsed-width="64"
          :width="180"
          class="app-sider"
        >
          <Sidebar 
            v-model:active-tab="activeTab" 
            :enabled="hasData"
          />
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
          <QuickActions v-if="activeTab === 'quick'" @execute="handleQuickAction" />
        </n-layout-content>
      </n-layout>

      <!-- 无数据时显示空状态 -->
      <n-layout position="absolute" style="top: 72px; bottom: 0;" v-else>
        <n-layout-content content-style="display: flex; justify-content: center; align-items: center; height: 100%;">
          <n-result status="info" title="欢迎使用 Magical Princess 存档编辑器" description="点击右上角「导入存档」按钮开始编辑">
            <template #footer>
              <div class="hint-text">
                <p>存档位置：%USERPROFILE%/AppData/LocalLow/Neotro Inc_/MagicalPrincess/</p>
                <p>存档文件格式：v10_userdata1.dat ~ v10_userdata31.dat</p>
              </div>
            </template>
          </n-result>
        </n-layout-content>
      </n-layout>

      <!-- 底栏 -->
      <n-layout-footer bordered position="absolute" class="app-footer" v-if="hasData">
        <span>{{ footerText }}</span>
      </n-layout-footer>
    </n-layout>
  </n-config-provider>
</template>

<script>
import { ref, computed } from 'vue'
import { NConfigProvider, NGlobalStyle, NLayout, NLayoutHeader, NLayoutSider, NLayoutContent, NLayoutFooter, NResult, darkTheme, createDiscreteApi } from 'naive-ui'
import { useSaveData } from './composables/useSaveData.js'
import { useQuickActions } from './composables/useQuickActions.js'

// 组件导入
import FileHandler from './components/FileHandler.vue'
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
    NConfigProvider, NGlobalStyle, NLayout, NLayoutHeader, NLayoutSider, NLayoutContent, NLayoutFooter, NResult,
    FileHandler, Sidebar, BasicEditor, DetailedEditor, EquipmentEditor, FriendEditor, ItemEditor, SkillEditor, GlobalEditor, QuickActions
  },
  
  setup() {
    const { message } = createDiscreteApi(['message'], {
      configProviderProps: { theme: darkTheme }
    })
    
    const { 
      saveData, isLoading, fileName, error, importSave, downloadSave, getMonthText, hasData
    } = useSaveData()
    
    const { executeAction } = useQuickActions(saveData)
    
    const activeTab = ref('basic')
    
    const footerText = computed(() => {
      if (!saveData.value) return ''
      const slot = saveData.value.saveSlotId || 1
      const month = getMonthText(saveData.value.status?.period || 0)
      const money = saveData.value.status?.money || 0
      return `存档槽位: ${slot} | ${month} | 金钱: ${money}`
    })
    
    const handleImport = async (file) => {
      await importSave(file)
      if (!error.value) {
        activeTab.value = 'basic'
        message.success('存档导入成功')
      } else {
        message.error(`导入失败: ${error.value}`)
      }
    }
    
    const handleExport = () => {
      downloadSave()
      message.success('存档已导出')
    }
    
    const handleQuickAction = (action) => {
      const resultMessage = executeAction(action)
      if (resultMessage) {
        message.success(resultMessage)
      }
    }
    
    return {
      darkTheme,
      saveData, isLoading, fileName, activeTab, hasData, footerText,
      handleImport, handleExport, handleQuickAction
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
  max-width: 1400px;
  margin: 0 auto;
}

.app-header h1 {
  margin: 0;
  font-size: 1.5rem;
  font-weight: 600;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
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
  justify-content: center;
  font-size: 0.85rem;
  color: #888;
}

.hint-text {
  color: #888;
  font-size: 0.85rem;
  text-align: center;
  line-height: 1.8;
}
.hint-text p {
  margin: 0;
}
</style>