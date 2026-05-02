<template>
  <section class="editor-section">
    <h2 class="section-title">物品列表</h2>
    <div class="list-controls">
      <n-button @click="addItem" type="primary" size="small">添加物品</n-button>
      <n-text depth="3" class="item-count">共 {{ itemList.length }} 个物品</n-text>
    </div>
    
    <n-data-table
      :columns="columns"
      :data="isMounting ? [] : itemList"
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
import { ItemNames } from '../data/gameData.js'

export default {
  name: 'ItemEditor',
  components: { NButton, NText, NDataTable },
  props: { itemList: { type: Array, required: true } },
  emits: ['update:itemList'],
  setup(props, { emit }) {
    const tableHeight = ref(600)
    const isMounting = ref(true)
    
    const updateHeight = () => {
      tableHeight.value = window.innerHeight - 250
    }

    onMounted(() => {
      updateHeight()
      window.addEventListener('resize', updateHeight)
      
      // Delay render to let Naive UI show the loading spinner and avoid locking UI instantly
      setTimeout(() => {
        isMounting.value = false
      }, 50)
    })

    onUnmounted(() => {
      window.removeEventListener('resize', updateHeight)
    })

    const getItemName = (id) => ItemNames[id] || `物品#${id}`
    
    const addItem = () => {
      emit('update:itemList', [...props.itemList, {
        itemId: 0, count: 1, useCount: 0, getCount: 0,
        isCraft: false, monthStock: 0, countTemp: 0, isShowGetEffect: false
      }])
    }
    
    const removeItem = (index) => {
      emit('update:itemList', props.itemList.filter((_, i) => i !== index))
    }

    const columns = computed(() => [
      {
        title: '物品名称 (ID)',
        key: 'name',
        width: 250,
        render(row) {
          return h('div', { class: 'item-name-cell' }, [
            h('span', { class: 'item-name' }, getItemName(row.itemId)),
            h(NInputNumber, {
              value: row.itemId,
              min: 0,
              size: 'tiny',
              style: { width: '100px' },
              'onUpdate:value': (v) => row.itemId = v
            })
          ])
        }
      },
      {
        title: '数量',
        key: 'count',
        width: 150,
        render(row) {
          return h(NInputNumber, {
            value: row.count,
            min: 0,
            size: 'small',
            'onUpdate:value': (v) => row.count = v
          })
        }
      },
      {
        title: '使用次数',
        key: 'useCount',
        width: 150,
        render(row) {
          return h(NInputNumber, {
            value: row.useCount,
            min: 0,
            size: 'small',
            'onUpdate:value': (v) => row.useCount = v
          })
        }
      },
      {
        title: '已合成',
        key: 'isCraft',
        width: 100,
        render(row) {
          return h(NCheckbox, {
            checked: row.isCraft,
            'onUpdate:checked': (v) => row.isCraft = v
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
            onClick: () => removeItem(index)
          }, { default: () => '删除' })
        }
      }
    ])

    return { getItemName, addItem, removeItem, columns, tableHeight, isMounting }
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
:deep(.item-name-cell) {
  display: flex;
  flex-direction: column;
  gap: 4px;
}
:deep(.item-name) {
  font-weight: 600;
  color: #9c88ff;
}
</style>