<template>
  <section class="editor-section page-table">
    <h2 class="section-title">技能列表</h2>
    <div class="list-controls">
      <n-text depth="3" class="skill-count">共 {{ skillList.length }} 个技能</n-text>
    </div>
    
    <n-card title="技能列表" size="small" class="table-panel">
      <n-data-table
        :columns="columns"
        :data="isMounting ? [] : skillList"
        :loading="isMounting"
        :max-height="tableHeight"
        size="small"
        :row-key="(row, index) => index"
      />
    </n-card>
  </section>
</template>

<script>
import { h, computed, ref, onMounted } from 'vue'
import { NText, NDataTable, NCheckbox, NCard } from 'naive-ui'
import { SkillNames } from '../data/gameData.js'
import { useViewportTableHeight } from '../composables/useViewportTableHeight.js'

export default {
  name: 'SkillEditor',
  components: { NText, NDataTable, NCard },
  props: { skillList: { type: Array, required: true } },
  setup() {
    const { tableHeight } = useViewportTableHeight(280, 360)
    const isMounting = ref(true)

    onMounted(() => {
      setTimeout(() => {
        isMounting.value = false
      }, 50)
    })

    const getSkillName = (id) => SkillNames[id] || `技能#${id}`
    
    const columns = computed(() => [
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
    ])

    return { columns, tableHeight, isMounting }
  }
}
</script>

