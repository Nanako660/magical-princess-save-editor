<template>
  <section class="editor-section page-table">
    <h2 class="section-title">课程数据</h2>
    
    <n-card title="快捷操作" size="small" class="curriculum-actions-card">
      <n-space>
        <n-button type="warning" ghost @click="openActionConfirm('complete')">全部完成</n-button>
        <n-button type="error" ghost @click="openActionConfirm('reset')">全部重置</n-button>
      </n-space>
    </n-card>
    
    <n-card title="课程列表" size="small">
      <n-scrollbar class="table-scroll-shell" :style="{ maxHeight: `${tableHeight}px` }">
        <div v-if="!isReady" class="table-loading-state">
          <n-skeleton text :repeat="6" />
        </div>
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
            <tr v-for="curriculum in visibleCurriculums" :key="curriculum.curriculumId">
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

    <n-modal
      v-model:show="showConfirmModal"
      preset="dialog"
      :type="pendingAction?.type || 'warning'"
      :title="pendingAction?.title || '确认操作'"
    >
      <p style="color: #ccc;">{{ pendingAction?.message }}</p>
      <template #action>
        <n-button :type="pendingAction?.type || 'warning'" @click="handleConfirmAction">
          {{ pendingAction?.confirmText || '确认' }}
        </n-button>
        <n-button @click="showConfirmModal = false">取消</n-button>
      </template>
    </n-modal>
  </section>
</template>

<script>
import { computed, ref } from 'vue'
import { NCard, NSpace, NButton, NScrollbar, NTable, NSwitch, NInputNumber, NSkeleton, NModal } from 'naive-ui'
import { CurriculumNames } from '../data/gameData.js'
import { useViewportTableHeight } from '../composables/useViewportTableHeight.js'
import { useDeferredTableRender } from '../composables/useDeferredTableRender.js'

export default {
  name: 'CurriculumEditor',
  components: { NCard, NSpace, NButton, NScrollbar, NTable, NSwitch, NInputNumber, NSkeleton, NModal },
  props: {
    curriculumList: { type: Array, required: true }
  },
  emits: ['update:curriculumList'],
  setup(props, { emit }) {
    const showConfirmModal = ref(false)
    const pendingAction = ref(null)
    const { tableHeight } = useViewportTableHeight(320, 360)
    const sortedCurriculums = computed(() => {
      return [...props.curriculumList].sort((a, b) => a.curriculumId - b.curriculumId)
    })
    const { isReady, visibleCount } = useDeferredTableRender(
      computed(() => sortedCurriculums.value.length),
      { initialCount: 24, batchSize: 24 }
    )
    const visibleCurriculums = computed(() => sortedCurriculums.value.slice(0, visibleCount.value))
    
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

    const openActionConfirm = (action) => {
      pendingAction.value = action === 'reset'
        ? {
            action,
            type: 'error',
            title: '确认：全部重置',
            message: '将把全部课程重置为未激活、未完成，剩余耐力归零。',
            confirmText: '确认重置'
          }
        : {
            action,
            type: 'warning',
            title: '确认：全部完成',
            message: '将把全部课程设为已激活、已完成，剩余耐力设为 100。',
            confirmText: '确认完成'
          }
      showConfirmModal.value = true
    }

    const handleConfirmAction = () => {
      if (!pendingAction.value) return
      if (pendingAction.value.action === 'reset') {
        resetAll()
      } else {
        completeAll()
      }
      showConfirmModal.value = false
      pendingAction.value = null
    }
    
    return {
      visibleCurriculums,
      getCurriculumName,
      tableHeight,
      isReady,
      showConfirmModal,
      pendingAction,
      openActionConfirm,
      handleConfirmAction
    }
  }
}
</script>

<style scoped>
.curriculum-actions-card {
  margin-bottom: 10px;
}

.table-loading-state {
  padding-bottom: 8px;
}
</style>
