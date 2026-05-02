<template>
  <div class="setup-guide">
    <n-card class="guide-card" :bordered="true">
      <div class="guide-header">
        <n-icon size="48" color="#667eea"><GameControllerOutline /></n-icon>
        <h2>Magical Princess 存档编辑器</h2>
        <p class="subtitle">首次使用，请先配置存档目录</p>
      </div>

      <n-steps :current="currentStep" vertical size="small">
        <n-step title="找到游戏存档文件夹">
          <div class="step-content">
            <p>游戏存档位于以下路径：</p>
            <n-code :code="savePath" language="text" class="path-code" />
            <n-button
              size="tiny"
              quaternary
              type="primary"
              @click="copyPath"
              style="margin-top: 8px;"
            >
              {{ copied ? '已复制 ✓' : '复制路径' }}
            </n-button>
          </div>
        </n-step>
        <n-step title="选择存档目录">
          <div class="step-content">
            <p>点击下方按钮，在弹出的窗口中选择上述文件夹：</p>
            <n-button
              type="primary"
              size="large"
              @click="$emit('pickDir')"
              :loading="loading"
              style="margin-top: 8px;"
            >
              <template #icon><n-icon><FolderOpenOutline /></n-icon></template>
              选择存档目录
            </n-button>
          </div>
        </n-step>
      </n-steps>

      <n-alert type="info" :bordered="false" style="margin-top: 24px;">
        <template #header>提示</template>
        配置一次后会自动记忆，下次打开无需重复操作。推荐使用 Chrome 或 Edge 浏览器。
      </n-alert>
    </n-card>
  </div>
</template>

<script>
import { ref } from 'vue'
import { NCard, NSteps, NStep, NButton, NIcon, NCode, NAlert } from 'naive-ui'
import { GameControllerOutline, FolderOpenOutline } from '@vicons/ionicons5'

export default {
  name: 'SetupGuide',
  components: { NCard, NSteps, NStep, NButton, NIcon, NCode, NAlert, GameControllerOutline, FolderOpenOutline },
  props: {
    loading: { type: Boolean, default: false }
  },
  emits: ['pickDir'],
  setup() {
    const savePath = '%USERPROFILE%\\AppData\\LocalLow\\Neotro Inc_\\MagicalPrincess\\'
    const copied = ref(false)
    const currentStep = ref(1)

    const copyPath = async () => {
      try {
        await navigator.clipboard.writeText(savePath.replace(/\\\\/g, '\\'))
        copied.value = true
        setTimeout(() => { copied.value = false }, 2000)
      } catch {}
    }

    return { savePath, copied, currentStep, copyPath }
  }
}
</script>

<style scoped>
.setup-guide {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  padding: 24px;
  box-sizing: border-box;
}
.guide-card {
  max-width: 520px;
  width: 100%;
}
.guide-header {
  text-align: center;
  margin-bottom: 28px;
}
.guide-header h2 {
  margin: 12px 0 4px;
  font-size: 1.4rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
.subtitle {
  color: #999;
  margin: 0;
  font-size: 0.9rem;
}
.step-content {
  padding: 8px 0;
}
.step-content p {
  margin: 0 0 4px;
  font-size: 0.85rem;
  color: #ccc;
}
.path-code {
  font-size: 0.8rem;
}
</style>
