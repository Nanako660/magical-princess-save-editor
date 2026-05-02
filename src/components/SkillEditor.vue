<template>
  <section class="editor-section page-table">
    <h2 class="section-title">技能列表</h2>
    <div class="list-controls">
      <n-text depth="3" class="skill-count">共 {{ skillList.length }} 个技能</n-text>
    </div>
    
    <div class="table-panel table-panel--flat">
      <div v-if="!isReady" class="table-loading-state">
        <n-skeleton text :repeat="6" />
      </div>
      <n-data-table
        :columns="columns"
        :data="visibleSkillList"
        :loading="!isReady"
        :max-height="tableHeight"
        size="small"
        virtual-scroll
        :row-key="(row, index) => index"
      />
    </div>
  </section>
</template>

<script>
import { h, computed } from 'vue'
import { NText, NDataTable, NCheckbox, NSkeleton } from 'naive-ui'
import { SkillNames } from '../data/gameData.js'
import { useViewportTableHeight } from '../composables/useViewportTableHeight.js'
import { useDeferredTableRender } from '../composables/useDeferredTableRender.js'

export default {
  name: 'SkillEditor',
  components: { NText, NDataTable, NSkeleton },
  props: { skillList: { type: Array, required: true } },
  setup(props) {
    const { tableHeight } = useViewportTableHeight(280, 360)
    const { isReady, visibleCount } = useDeferredTableRender(
      computed(() => props.skillList.length),
      { initialCount: 28, batchSize: 28 }
    )

    const getSkillName = (id) => SkillNames[id] || `技能#${id}`

    const visibleSkillList = computed(() => props.skillList.slice(0, visibleCount.value))

    const columns = [
      {
        title: '技能名称 (ID)',
        key: 'name',
        minWidth: 220,
        render(row) {
          return h('span', { class: 'skill-name' }, `${getSkillName(row.skillId)} (#${row.skillId})`)
        }
      },
      {
        title: '已解锁',
        key: 'isOpened',
        width: 96,
        render(row) {
          return h(NCheckbox, {
            checked: row.isOpened,
            'onUpdate:checked': (v) => row.isOpened = v
          })
        }
      },
      {
        title: '已学习',
        key: 'isLearned',
        width: 96,
        render(row) {
          return h(NCheckbox, {
            checked: row.isLearned,
            'onUpdate:checked': (v) => row.isLearned = v
          })
        }
      }
    ]

    return { columns, tableHeight, isReady, visibleSkillList }
  }
}
</script>

<style scoped>
.table-panel--flat {
  min-height: 0;
}

.table-loading-state {
  padding: 12px 0 4px;
}
</style>

