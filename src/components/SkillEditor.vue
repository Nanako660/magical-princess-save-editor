<template>
  <section class="editor-section">
    <h2 class="section-title">技能列表</h2>
    <div class="list-controls">
      <n-text depth="3" class="skill-count">共 {{ skillList.length }} 个技能</n-text>
    </div>
    
    <n-data-table
      :columns="columns"
      :data="isMounting ? [] : skillList"
      :loading="isMounting"
      :max-height="tableHeight"
      size="small"
      :row-key="(row, index) => index"
    />
  </section>
</template>

<script>
import { h, computed, ref, onMounted, onUnmounted } from 'vue'
import { NText, NDataTable, NCheckbox } from 'naive-ui'
import { SkillNames } from '../data/gameData.js'

export default {
  name: 'SkillEditor',
  components: { NText, NDataTable },
  props: { skillList: { type: Array, required: true } },
  setup() {
    const tableHeight = ref(600)
    const isMounting = ref(true)
    
    const updateHeight = () => {
      tableHeight.value = window.innerHeight - 250
    }

    onMounted(() => {
      updateHeight()
      window.addEventListener('resize', updateHeight)
      
      setTimeout(() => {
        isMounting.value = false
      }, 50)
    })

    onUnmounted(() => {
      window.removeEventListener('resize', updateHeight)
    })

    const getSkillName = (id) => SkillNames[id] || `技能#${id}`
    
    const columns = computed(() => [
      {
        title: '技能名称 (ID)',
        key: 'name',
        width: 350,
        render(row) {
          return h('span', { class: 'skill-name' }, `${getSkillName(row.skillId)} (#${row.skillId})`)
        }
      },
      {
        title: '已解锁',
        key: 'isOpened',
        width: 150,
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
        width: 150,
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

<style scoped>
.section-title {
  margin-bottom: 1.5rem;
  color: #667eea;
  border-bottom: 2px solid #667eea;
  padding-bottom: 0.5rem;
}
</style>
