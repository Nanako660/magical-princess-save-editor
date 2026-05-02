<template>
  <section class="editor-section page-table">
    <h2 class="section-title">活动数据</h2>
    
    <n-card title="活动列表" size="small">
      <n-scrollbar class="table-scroll-shell" :style="{ maxHeight: `${tableHeight}px` }">
        <div v-if="!isReady" class="table-loading-state">
          <n-skeleton text :repeat="6" />
        </div>
        <n-table :bordered="false" :single-line="false" size="small">
          <thead>
            <tr>
              <th style="width: 56px;">ID</th>
              <th>活动名称</th>
              <th style="width: 92px;">等级</th>
              <th style="width: 92px;">总次数</th>
              <th style="width: 92px;">本月次数</th>
              <th style="width: 92px;">失败次数</th>
              <th style="width: 92px;">伤害次数</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="activity in visibleActivities" :key="activity.activityID">
              <td>{{ activity.activityID }}</td>
              <td>{{ getActivityName(activity.activityID) }}</td>
              <td>
                <n-input-number 
                  v-model:value="activity.level" 
                  :min="0" 
                  :max="10"
                  size="small"
                />
              </td>
              <td>
                <n-input-number 
                  v-model:value="activity.eventCount" 
                  :min="0"
                  size="small"
                />
              </td>
              <td>
                <n-input-number 
                  v-model:value="activity.eventCountMonth" 
                  :min="0"
                  size="small"
                />
              </td>
              <td>
                <n-input-number 
                  v-model:value="activity.badCount" 
                  :min="0"
                  size="small"
                />
              </td>
              <td>
                <n-input-number 
                  v-model:value="activity.damageCount" 
                  :min="0"
                  size="small"
                />
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
import { NCard, NScrollbar, NTable, NInputNumber, NSkeleton } from 'naive-ui'
import { ActivityNames } from '../data/gameData.js'
import { useViewportTableHeight } from '../composables/useViewportTableHeight.js'
import { useDeferredTableRender } from '../composables/useDeferredTableRender.js'

export default {
  name: 'ActivityEditor',
  components: { NCard, NScrollbar, NTable, NInputNumber, NSkeleton },
  props: {
    activityList: { type: Array, required: true }
  },
  emits: ['update:activityList'],
  setup(props) {
    const { tableHeight } = useViewportTableHeight(280, 360)
    const sortedActivities = computed(() => {
      return [...props.activityList].sort((a, b) => a.activityID - b.activityID)
    })
    const { isReady, visibleCount } = useDeferredTableRender(
      computed(() => sortedActivities.value.length),
      { initialCount: 24, batchSize: 24 }
    )
    const visibleActivities = computed(() => sortedActivities.value.slice(0, visibleCount.value))
    
    const getActivityName = (id) => {
      return ActivityNames[id] || `未知活动(${id})`
    }
    
    return { visibleActivities, getActivityName, tableHeight, isReady }
  }
}
</script>

<style scoped>
.table-loading-state {
  padding-bottom: 8px;
}
</style>
