<template>
  <section class="editor-section page-table">
    <h2 class="section-title">战斗技能</h2>
    
    <n-card title="快捷操作" size="small" style="margin-bottom: 16px;">
      <n-space>
        <n-button type="warning" ghost @click="learnAllArts">全部学习</n-button>
        <n-button type="error" ghost @click="resetAllArts">全部取消</n-button>
      </n-space>
    </n-card>
    
    <n-card title="技能列表" size="small">
      <n-scrollbar class="table-scroll-shell" :style="{ maxHeight: `${tableHeight}px` }">
        <div v-if="!isReady" class="table-loading-state">
          <n-skeleton text :repeat="5" />
        </div>
        <n-table :bordered="false" :single-line="false" size="small">
          <thead>
            <tr>
              <th>ID</th>
              <th>技能名称</th>
              <th>已学习</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="arts in visibleArts" :key="arts.battleArtsId">
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
import { NCard, NSpace, NButton, NScrollbar, NTable, NSwitch, NSkeleton } from 'naive-ui'
import { BattleArtsNames } from '../data/gameData.js'
import { useViewportTableHeight } from '../composables/useViewportTableHeight.js'
import { useDeferredTableRender } from '../composables/useDeferredTableRender.js'

export default {
  name: 'BattleArtsEditor',
  components: { NCard, NSpace, NButton, NScrollbar, NTable, NSwitch, NSkeleton },
  props: {
    artsList: { type: Array, required: true }
  },
  emits: ['update:artsList'],
  setup(props, { emit }) {
    const { tableHeight } = useViewportTableHeight(320, 360)
    const sortedArts = computed(() => {
      return [...props.artsList].sort((a, b) => a.battleArtsId - b.battleArtsId)
    })
    const { isReady, visibleCount } = useDeferredTableRender(
      computed(() => sortedArts.value.length),
      { initialCount: 20, batchSize: 20 }
    )
    const visibleArts = computed(() => sortedArts.value.slice(0, visibleCount.value))
    
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
    
    return { visibleArts, getArtsName, learnAllArts, resetAllArts, tableHeight, isReady }
  }
}
</script>

<style scoped>
.table-loading-state {
  padding-bottom: 8px;
}
</style>
