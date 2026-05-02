<template>
  <section class="editor-section">
    <h2 class="section-title">NPC好感度</h2>
    
    <!-- 可攻略NPC -->
    <section class="npc-group">
      <h3 class="group-title">可攻略角色</h3>
      <div class="card-grid">
        <div class="card-grid-item card-grid-item--quarter" v-for="index in romanceableNPCs" :key="index">
          <n-card size="small">
            <template #header>
              <span class="npc-name">{{ getCharaName(friendList[index]?.friendId || index) }}</span>
            </template>
            <template #header-extra>
              <n-text depth="3">好感: {{ friendList[index]?.fFavarite }}</n-text>
            </template>
            <n-form :model="friendList[index]" label-placement="top">
              <n-grid :cols="2" :x-gap="12">
                <n-form-item-gi label="好感度">
                  <n-input-number v-model:value="friendList[index].fFavarite" :min="0" :max="100" size="small" />
                </n-form-item-gi>
                <n-form-item-gi label="见面次数">
                  <n-input-number v-model:value="friendList[index].fMeet" :min="0" size="small" />
                </n-form-item-gi>
                <n-form-item-gi label="对话次数">
                  <n-input-number v-model:value="friendList[index].fConversation" :min="0" size="small" />
                </n-form-item-gi>
                <n-form-item-gi label="约会次数">
                  <n-input-number v-model:value="friendList[index].fDate" :min="0" size="small" />
                </n-form-item-gi>
                <n-form-item-gi label="送礼次数">
                  <n-input-number v-model:value="friendList[index].fPresent" :min="0" size="small" />
                </n-form-item-gi>
                <n-form-item-gi label="恋爱事件" v-if="friendList[index].fLoveEvents !== undefined">
                  <n-input-number v-model:value="friendList[index].fLoveEvents" :min="0" :max="4" size="small" />
                </n-form-item-gi>
              </n-grid>
            </n-form>
          </n-card>
        </div>
      </div>
    </section>

    <!-- 其他NPC -->
    <section class="npc-group">
      <h3 class="group-title">其他NPC</h3>
      <div class="card-grid">
        <div class="card-grid-item card-grid-item--quarter" v-for="index in otherNPCs" :key="index">
          <n-card size="small">
            <template #header>
              <span class="npc-name">{{ getCharaName(friendList[index]?.friendId || index) }}</span>
            </template>
            <template #header-extra>
              <n-text depth="3">好感: {{ friendList[index]?.fFavarite }}</n-text>
            </template>
            <n-form :model="friendList[index]" label-placement="top">
              <n-grid :cols="2" :x-gap="12">
                <n-form-item-gi label="好感度">
                  <n-input-number v-model:value="friendList[index].fFavarite" :min="0" :max="100" size="small" />
                </n-form-item-gi>
                <n-form-item-gi label="见面次数">
                  <n-input-number v-model:value="friendList[index].fMeet" :min="0" size="small" />
                </n-form-item-gi>
                <n-form-item-gi label="对话次数">
                  <n-input-number v-model:value="friendList[index].fConversation" :min="0" size="small" />
                </n-form-item-gi>
                <n-form-item-gi label="约会次数">
                  <n-input-number v-model:value="friendList[index].fDate" :min="0" size="small" />
                </n-form-item-gi>
                <n-form-item-gi label="送礼次数">
                  <n-input-number v-model:value="friendList[index].fPresent" :min="0" size="small" />
                </n-form-item-gi>
              </n-grid>
            </n-form>
          </n-card>
        </div>
      </div>
    </section>
  </section>
</template>

<script>
import { NCard, NForm, NGrid, NFormItemGi, NInputNumber, NText } from 'naive-ui'
import { FriendNames, FriendJobs, RomanceableNPCs } from '../data/gameData.js'

export default {
  name: 'FriendEditor',
  components: { NCard, NForm, NGrid, NFormItemGi, NInputNumber, NText },
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
.npc-group + .npc-group {
  margin-top: 28px;
}

.group-title {
  margin: 0 0 1rem;
  color: #9ca3af;
  font-size: 1rem;
  font-weight: 600;
}

.npc-name {
  font-weight: 600;
}
</style>
