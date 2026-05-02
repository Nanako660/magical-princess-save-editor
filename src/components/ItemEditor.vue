<template>
  <section class="editor-section">
    <h2 class="section-title">物品列表</h2>
    <div class="list-controls">
      <n-text depth="3" class="item-count">共 {{ itemList.length }} 个物品</n-text>
    </div>
    
    <n-scrollbar class="item-groups">
      <div v-for="group in groupedItems" :key="group.name" class="item-group">
        <h3 class="group-title">{{ group.name }} ({{ group.items.length }})</h3>
        <n-data-table
          :columns="columns"
          :data="isMounting ? [] : group.items"
          size="small"
          :row-key="(row) => row._index"
        />
      </div>
    </n-scrollbar>
  </section>
</template>

<script>
import { h, computed, ref } from 'vue'
import { NText, NDataTable, NInputNumber, NCheckbox, NScrollbar } from 'naive-ui'
import { ItemNames, ItemGroups, ItemCategoryMap } from '../data/gameData.js'

export default {
  name: 'ItemEditor',
  components: { NText, NDataTable, NScrollbar },
  props: { itemList: { type: Array, required: true } },
  setup(props) {
    const isMounting = ref(true)

    setTimeout(() => { isMounting.value = false }, 50)

    const getItemName = (id) => ItemNames[id] || `物品#${id}`
    
    const getItemGroup = (itemId) => {
      const cat = ItemCategoryMap[itemId]
      if (cat !== undefined) {
        const group = ItemGroups.find(g => g.category === cat)
        if (group) return group.name
      }
      return '未分类'
    }

    const groupedItems = computed(() => {
      const groups = ItemGroups.map(g => ({ name: g.name, items: [] }))
      const groupMap = {}
      groups.forEach(g => { groupMap[g.name] = g })
      
      props.itemList.forEach((item, index) => {
        const groupName = getItemGroup(item.itemId)
        if (groupMap[groupName]) {
          groupMap[groupName].items.push({ ...item, _index: index })
        }
      })
      
      return groups.filter(g => g.items.length > 0)
    })
    
    const columns = computed(() => [
      {
        title: '物品名称 (ID)',
        key: 'name',
        width: 300,
        render(row) {
          return h('span', { class: 'item-name' }, `${getItemName(row.itemId)} (#${row.itemId})`)
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
      }
    ])

    return { columns, isMounting, groupedItems }
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
.item-groups {
  flex: 1;
  min-height: 0;
}
.item-group {
  margin-bottom: 1.5rem;
}
.group-title {
  color: #8b5cf6;
  font-size: 1rem;
  margin-bottom: 0.5rem;
  padding-left: 0.5rem;
  border-left: 3px solid #8b5cf6;
}
:deep(.item-name) {
  font-weight: 600;
  color: #9c88ff;
}
</style>
