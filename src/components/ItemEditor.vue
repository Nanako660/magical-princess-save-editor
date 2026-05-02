<template>
  <section class="editor-section page-table">
    <h2 class="section-title">物品列表</h2>
    <div class="list-controls">
      <n-text depth="3" class="item-count">共 {{ itemList.length }} 个物品</n-text>
    </div>
    
    <div class="table-panel table-panel--flat">
      <n-scrollbar class="item-groups table-scroll-shell" :style="{ maxHeight: `${tableHeight}px` }">
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
    </div>
  </section>
</template>

<script>
import { h, computed, ref } from 'vue'
import { NText, NDataTable, NInputNumber, NCheckbox, NScrollbar } from 'naive-ui'
import { ItemNames, ItemGroups, ItemCategoryMap } from '../data/gameData.js'
import { useViewportTableHeight } from '../composables/useViewportTableHeight.js'

export default {
  name: 'ItemEditor',
  components: { NText, NDataTable, NScrollbar },
  props: { itemList: { type: Array, required: true } },
  setup(props) {
    const { tableHeight } = useViewportTableHeight(280, 360)
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
        minWidth: 220,
        render(row) {
          return h('span', { class: 'item-name' }, `${getItemName(row.itemId)} (#${row.itemId})`)
        }
      },
      {
        title: '数量',
        key: 'count',
        width: 120,
        render(row) {
          return h(NInputNumber, {
            value: row.count,
            min: 0,
            size: 'small',
            style: 'width: 100px',
            'onUpdate:value': (v) => row.count = v
          })
        }
      },
      {
        title: '使用次数',
        key: 'useCount',
        width: 120,
        render(row) {
          return h(NInputNumber, {
            value: row.useCount,
            min: 0,
            size: 'small',
            style: 'width: 100px',
            'onUpdate:value': (v) => row.useCount = v
          })
        }
      },
      {
        title: '已合成',
        key: 'isCraft',
        width: 88,
        render(row) {
          return h(NCheckbox, {
            checked: row.isCraft,
            'onUpdate:checked': (v) => row.isCraft = v
          })
        }
      }
    ])

    return { columns, isMounting, groupedItems, tableHeight }
  }
}
</script>

<style scoped>
.group-title {
  margin: 0 0 0.75rem;
  color: #9ca3af;
  font-size: 0.95rem;
  font-weight: 600;
}

.item-groups {
  min-height: 0;
}

.table-panel--flat {
  min-height: 0;
}
</style>
