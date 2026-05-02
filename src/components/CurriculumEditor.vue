<template>
  <section class="editor-section page-table">
    <h2 class="section-title">课程数据</h2>
    
    <n-card title="快捷操作" size="small" style="margin-bottom: 16px;">
      <n-space>
        <n-button type="warning" ghost @click="completeAll">全部完成</n-button>
        <n-button type="error" ghost @click="resetAll">全部重置</n-button>
      </n-space>
    </n-card>
    
    <n-card title="课程列表" size="small">
      <n-scrollbar class="table-scroll-shell" :style="{ maxHeight: `${tableHeight}px` }">
        <n-table :bordered="false" :single-line="false" size="small">
          <thead>
            <tr>
              <th style="width: 56px;">ID</th>
              <th>课程名称</th>
              <th style="width: 88px;">激活</th>
              <th style="width: 88px;">完成</th>
              <th style="width: 110px;">剩余耐力</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="curriculum in sortedCurriculums" :key="curriculum.curriculumId">
              <td>{{ curriculum.curriculumId }}</td>
              <td>{{ getCurriculumName(curriculum.curriculumId) }}</td>
              <td>
                <n-switch v-model:value="curriculum.isActive" />
              </td>
              <td>
                <n-switch v-model:value="curriculum.isComplete" />
              </td>
              <td>
                <n-input-number 
                  v-model:value="curriculum.restHP" 
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
import { NCard, NSpace, NButton, NScrollbar, NTable, NSwitch, NInputNumber } from 'naive-ui'
import { CurriculumNames } from '../data/gameData.js'
import { useViewportTableHeight } from '../composables/useViewportTableHeight.js'

export default {
  name: 'CurriculumEditor',
  components: { NCard, NSpace, NButton, NScrollbar, NTable, NSwitch, NInputNumber },
  props: {
    curriculumList: { type: Array, required: true }
  },
  emits: ['update:curriculumList'],
  setup(props, { emit }) {
    const { tableHeight } = useViewportTableHeight(320, 360)
    const sortedCurriculums = computed(() => {
      return [...props.curriculumList].sort((a, b) => a.curriculumId - b.curriculumId)
    })
    
    const getCurriculumName = (id) => {
      return CurriculumNames[id] || `未知课程(${id})`
    }
    
    const completeAll = () => {
      const updated = props.curriculumList.map(c => ({
        ...c,
        isActive: true,
        isComplete: true,
        restHP: 100
      }))
      emit('update:curriculumList', updated)
    }
    
    const resetAll = () => {
      const updated = props.curriculumList.map(c => ({
        ...c,
        isActive: false,
        isComplete: false,
        restHP: 0
      }))
      emit('update:curriculumList', updated)
    }
    
    return { sortedCurriculums, getCurriculumName, completeAll, resetAll, tableHeight }
  }
}
</script>
