<template>
  <section class="editor-section">
    <h2 class="section-title">NPC好感度</h2>
    <n-grid :cols="24" :x-gap="24" :y-gap="24" responsive="screen">
      <n-gi :span="8" v-for="(npc, index) in friendList" :key="index">
        <n-card size="small">
          <template #header>
            <span class="npc-name">{{ getCharaName(npc.friendId || index) }}</span>
          </template>
          <template #header-extra>
            <n-text depth="3">好感: {{ npc.fFavarite }}</n-text>
          </template>
          <n-form :model="npc" label-placement="left" label-width="80">
            <n-form-item label="好感度">
              <n-input-number v-model:value="npc.fFavarite" :min="0" :max="100" size="small" />
            </n-form-item>
            <n-form-item label="见面次数">
              <n-input-number v-model:value="npc.fMeet" :min="0" size="small" />
            </n-form-item>
            <n-form-item label="对话次数">
              <n-input-number v-model:value="npc.fConversation" :min="0" size="small" />
            </n-form-item>
            <n-form-item label="约会次数">
              <n-input-number v-model:value="npc.fDate" :min="0" size="small" />
            </n-form-item>
            <n-form-item label="送礼次数">
              <n-input-number v-model:value="npc.fPresent" :min="0" size="small" />
            </n-form-item>
            <n-form-item label="恋爱事件">
              <n-input-number v-model:value="npc.fLoveEvents" :min="0" :max="4" size="small" />
            </n-form-item>
          </n-form>
        </n-card>
      </n-gi>
    </n-grid>
  </section>
</template>

<script>
import { NGrid, NGi, NCard, NForm, NFormItem, NInputNumber, NText } from 'naive-ui'
import { FriendNames, FriendJobs } from '../data/gameData.js'

export default {
  name: 'FriendEditor',
  components: { NGrid, NGi, NCard, NForm, NFormItem, NInputNumber, NText },
  props: { friendList: { type: Array, required: true } },
  setup() {
    const getCharaName = (id) => {
      const name = FriendNames[id] || `NPC#${id}`
      const job = FriendJobs[id]
      return job ? `${name} - ${job}` : name
    }
    return { getCharaName }
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
.npc-name {
  font-weight: 600;
  color: #9c88ff;
}
</style>