<template>
  <section class="editor-section">
    <h2 class="section-title">NPC好感度</h2>
    
    <!-- 可攻略NPC -->
    <div class="npc-group">
      <h3 class="group-title">可攻略角色</h3>
      <n-grid :cols="24" :x-gap="24" :y-gap="24" responsive="screen">
        <n-gi :span="8" v-for="index in romanceableNPCs" :key="index">
          <n-card size="small">
            <template #header>
              <span class="npc-name">{{ getCharaName(friendList[index]?.friendId || index) }}</span>
            </template>
            <template #header-extra>
              <n-text depth="3">好感: {{ friendList[index]?.fFavarite }}</n-text>
            </template>
            <n-form :model="friendList[index]" label-placement="left" label-width="80">
              <n-form-item label="好感度">
                <n-input-number v-model:value="friendList[index].fFavarite" :min="0" :max="100" size="small" />
              </n-form-item>
              <n-form-item label="见面次数">
                <n-input-number v-model:value="friendList[index].fMeet" :min="0" size="small" />
              </n-form-item>
              <n-form-item label="对话次数">
                <n-input-number v-model:value="friendList[index].fConversation" :min="0" size="small" />
              </n-form-item>
              <n-form-item label="约会次数">
                <n-input-number v-model:value="friendList[index].fDate" :min="0" size="small" />
              </n-form-item>
              <n-form-item label="送礼次数">
                <n-input-number v-model:value="friendList[index].fPresent" :min="0" size="small" />
              </n-form-item>
              <n-form-item label="恋爱事件">
                <n-input-number v-model:value="friendList[index].fLoveEvents" :min="0" :max="4" size="small" />
              </n-form-item>
            </n-form>
          </n-card>
        </n-gi>
      </n-grid>
    </div>

    <!-- 其他NPC -->
    <div class="npc-group">
      <h3 class="group-title">其他NPC</h3>
      <n-grid :cols="24" :x-gap="24" :y-gap="24" responsive="screen">
        <n-gi :span="8" v-for="index in otherNPCs" :key="index">
          <n-card size="small">
            <template #header>
              <span class="npc-name">{{ getCharaName(friendList[index]?.friendId || index) }}</span>
            </template>
            <template #header-extra>
              <n-text depth="3">好感: {{ friendList[index]?.fFavarite }}</n-text>
            </template>
            <n-form :model="friendList[index]" label-placement="left" label-width="80">
              <n-form-item label="好感度">
                <n-input-number v-model:value="friendList[index].fFavarite" :min="0" :max="100" size="small" />
              </n-form-item>
              <n-form-item label="见面次数">
                <n-input-number v-model:value="friendList[index].fMeet" :min="0" size="small" />
              </n-form-item>
              <n-form-item label="对话次数">
                <n-input-number v-model:value="friendList[index].fConversation" :min="0" size="small" />
              </n-form-item>
              <n-form-item label="约会次数">
                <n-input-number v-model:value="friendList[index].fDate" :min="0" size="small" />
              </n-form-item>
              <n-form-item label="送礼次数">
                <n-input-number v-model:value="friendList[index].fPresent" :min="0" size="small" />
              </n-form-item>
            </n-form>
          </n-card>
        </n-gi>
      </n-grid>
    </div>
  </section>
</template>

<script>
import { NGrid, NGi, NCard, NForm, NFormItem, NInputNumber, NText } from 'naive-ui'
import { FriendNames, FriendJobs, RomanceableNPCs } from '../data/gameData.js'

export default {
  name: 'FriendEditor',
  components: { NGrid, NGi, NCard, NForm, NFormItem, NInputNumber, NText },
  props: { friendList: { type: Array, required: true } },
  setup(props) {
    const getCharaName = (id) => {
      const name = FriendNames[id] || `NPC#${id}`
      const job = FriendJobs[id]
      return job ? `${name} - ${job}` : name
    }
    
    const romanceableNPCs = RomanceableNPCs
    const otherNPCs = Array.from({ length: props.friendList.length }, (_, i) => i)
      .filter(i => !RomanceableNPCs.includes(i))
    
    return { getCharaName, romanceableNPCs, otherNPCs }
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
.friend-card {
  margin-bottom: 1rem;
}
.friend-card :deep(.n-card-header) {
  padding-left: 0.5rem;
}
</style>