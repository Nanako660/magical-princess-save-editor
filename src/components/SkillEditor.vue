<template>
  <section class="editor-section">
    <h2 class="section-title">技能列表</h2>
    <div class="list-controls">
      <n-button @click="addSkill" type="primary" size="small">添加技能</n-button>
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
import { NButton, NText, NDataTable, NInputNumber, NCheckbox } from 'naive-ui'
import { SkillNames } from '../data/gameData.js'

export default {
  name: 'SkillEditor',
  components: { NButton, NText, NDataTable },
  props: { skillList: { type: Array, required: true } },
  emits: ['update:skillList'],
  setup(props, { emit }) {
    const tableHeight = ref(600)
    const isMounting = ref(true)
    
    const updateHeight = () => {
      tableHeight.value = window.innerHeight - 250
    }

    onMounted(() => {
      updateHeight()
      window.addEventListener('resize', updateHeight)
      
      // Delay render to let Naive UI show the loading spinner
      setTimeout(() => {
        isMounting.value = false
      }, 50)
    })

    onUnmounted(() => {
      window.removeEventListener('resize', updateHeight)
    })

    const getSkillName = (id) => SkillNames[id] || `技能#${id}`
    
    const addSkill = () => {
      emit('update:skillList', [...props.skillList, {
        skillId: 0, isOpened: false, isLearned: false
      }])
    }
    
    const removeSkill = (index) => {
      emit('update:skillList', props.skillList.filter((_, i) => i !== index))
    }

    const columns = computed(() => [
      {
        title: '技能名称 (ID)',
        key: 'name',
        width: 300,
        render(row) {
          return h('div', { class: 'skill-name-cell' }, [
            h('span', { class: 'skill-name' }, getSkillName(row.skillId)),
            h(NInputNumber, {
              value: row.skillId,
              min: 0,
              size: 'tiny',
              style: { width: '100px' },
              'onUpdate:value': (v) => row.skillId = v
            })
          ])
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
      },
      {
        title: '操作',
        key: 'actions',
        width: 100,
        render(row, index) {
          return h(NButton, {
            type: 'error',
            size: 'small',
            ghost: true,
            onClick: () => removeSkill(index)
          }, { default: () => '删除' })
        }
      }
    ])

    return { addSkill, removeSkill, columns, tableHeight, isMounting }
  }
}
</script>

<style scoped>
.editor-section { 
  width: 100%;
  max-width: 1200px;
  height: calc(100vh - 156px);
  display: flex;
  flex-direction: column;
  overflow: hidden;
}
.section-title {
  margin-bottom: 1.5rem;
  color: #667eea;
  border-bottom: 2px solid #667eea;
  padding-bottom: 0.5rem;
}
.list-controls {
  display: flex;
  gap: 16px;
  align-items: center;
  margin-bottom: 16px;
}
:deep(.skill-name-cell) {
  display: flex;
  flex-direction: column;
  gap: 4px;
}
:deep(.skill-name) {
  font-weight: 600;
  color: #9c88ff;
}
</style>