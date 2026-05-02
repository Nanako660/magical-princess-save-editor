<template>
  <section class="editor-section">
    <h2 class="section-title">战斗技能</h2>
    
    <n-card title="快捷操作" size="small" style="margin-bottom: 16px;">
      <n-space>
        <n-button type="warning" ghost @click="learnAllArts">全部学习</n-button>
        <n-button type="error" ghost @click="resetAllArts">全部取消</n-button>
      </n-space>
    </n-card>
    
    <n-card title="技能列表" size="small">
      <n-scrollbar style="max-height: 500px;">
        <n-table :bordered="false" :single-line="false" size="small">
          <thead>
            <tr>
              <th style="width: 60px;">ID</th>
              <th style="width: 180px;">技能名称</th>
              <th style="width: 100px;">已学习</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="arts in sortedArts" :key="arts.battleArtsId">
              <td>{{ arts.battleArtsId }}</td>
              <td>{{ getArtsName(arts.battleArtsId) }}</td>
              <td>
                <n-switch v-model:value="arts.isLearned" />
              </td>
            </tr>
          </tbody>
        </n-table>
      </n-scrollbar>
    </n-card>
  </section>
</template>

<script>
import { computed } from 'vue'
import { NCard, NSpace, NButton, NScrollbar, NTable, NSwitch } from 'naive-ui'
import { BattleArtsNames } from '../data/gameData.js'

export default {
  name: 'BattleArtsEditor',
  components: { NCard, NSpace, NButton, NScrollbar, NTable, NSwitch },
  props: {
    artsList: { type: Array, required: true }
  },
  emits: ['update:artsList'],
  setup(props, { emit }) {
    const sortedArts = computed(() => {
      return [...props.artsList].sort((a, b) => a.battleArtsId - b.battleArtsId)
    })
    
    const getArtsName = (id) => {
      return BattleArtsNames[id] || `未知技能(${id})`
    }
    
    const learnAllArts = () => {
      const updated = props.artsList.map(arts => ({
        ...arts,
        isLearned: true
      }))
      emit('update:artsList', updated)
    }
    
    const resetAllArts = () => {
      const updated = props.artsList.map(arts => ({
        ...arts,
        isLearned: false
      }))
      emit('update:artsList', updated)
    }
    
    return { sortedArts, getArtsName, learnAllArts, resetAllArts }
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
</style>