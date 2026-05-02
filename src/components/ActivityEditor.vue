<template>
  <section class="editor-section">
    <h2 class="section-title">活动数据</h2>
    
    <n-card title="活动列表" size="small">
      <n-scrollbar style="max-height: 600px;">
        <n-table :bordered="false" :single-line="false" size="small">
          <thead>
            <tr>
              <th style="width: 60px;">ID</th>
              <th style="width: 150px;">活动名称</th>
              <th style="width: 60px;">等级</th>
              <th style="width: 80px;">总次数</th>
              <th style="width: 80px;">本月次数</th>
              <th style="width: 80px;">失败次数</th>
              <th style="width: 80px;">伤害次数</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="activity in sortedActivities" :key="activity.activityID">
              <td>{{ activity.activityID }}</td>
              <td>{{ getActivityName(activity.activityID) }}</td>
              <td>
                <n-input-number 
                  v-model:value="activity.level" 
                  :min="0" 
                  :max="10"
                  size="small"
                  style="width: 60px;"
                />
              </td>
              <td>
                <n-input-number 
                  v-model:value="activity.eventCount" 
                  :min="0"
                  size="small"
                  style="width: 70px;"
                />
              </td>
              <td>
                <n-input-number 
                  v-model:value="activity.eventCountMonth" 
                  :min="0"
                  size="small"
                  style="width: 70px;"
                />
              </td>
              <td>
                <n-input-number 
                  v-model:value="activity.badCount" 
                  :min="0"
                  size="small"
                  style="width: 70px;"
                />
              </td>
              <td>
                <n-input-number 
                  v-model:value="activity.damageCount" 
                  :min="0"
                  size="small"
                  style="width: 70px;"
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
import { NCard, NScrollbar, NTable, NInputNumber } from 'naive-ui'
import { ActivityNames } from '../data/gameData.js'

export default {
  name: 'ActivityEditor',
  components: { NCard, NScrollbar, NTable, NInputNumber },
  props: {
    activityList: { type: Array, required: true }
  },
  emits: ['update:activityList'],
  setup(props) {
    const sortedActivities = computed(() => {
      return [...props.activityList].sort((a, b) => a.activityID - b.activityID)
    })
    
    const getActivityName = (id) => {
      return ActivityNames[id] || `未知活动(${id})`
    }
    
    return { sortedActivities, getActivityName }
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