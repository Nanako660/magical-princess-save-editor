<template>
  <section class="editor-section page-table">
    <h2 class="section-title">物品列表</h2>
    <div class="list-controls">
      <n-text depth="3" class="item-count">共 {{ itemList.length }} 个物品</n-text>
    </div>
    
    <div class="table-panel table-panel--flat">
      <n-scrollbar class="item-groups table-scroll-shell" :style="{ maxHeight: `${tableHeight}px` }">
        <div v-for="(group, index) in groupedItems" :key="group.name" class="item-group">
          <h3 class="group-title">{{ group.name }} ({{ group.items.length }})</h3>
          <div v-if="!isReady || index >= visibleGroupCount" class="group-loading-state">
            <n-skeleton text :repeat="2" />
          </div>
          <n-data-table
            v-else
            :columns="columns"
            :data="group.items"
            size="small"
            virtual-scroll
            :row-key="(row) => row._index"
          />
        </div>
      </n-scrollbar>
    </div>
  </section>
</template>

<script>
import { h, computed } from 'vue'
import { NText, NDataTable, NInputNumber, NCheckbox, NScrollbar, NSkeleton } from 'naive-ui'
import { ItemNames, ItemGroups, ItemCategoryMap } from '../data/gameData.js'
import { useViewportTableHeight } from '../composables/useViewportTableHeight.js'
import { useDeferredTableRender } from '../composables/useDeferredTableRender.js'

const ITEM_GROUP_NAME_BY_ID = Object.fromEntries(
  Object.entries(ItemCategoryMap).map(([itemId, category]) => {
    const group = ItemGroups.find((entry) => entry.category === category)
    return [itemId, group?.name || '未分类']
  })
)

export default {
  name: 'ItemEditor',
  components: { NText, NDataTable, NScrollbar, NSkeleton },
  props: { itemList: { type: Array, required: true } },
  setup(props) {
    const { tableHeight } = useViewportTableHeight(280, 360)
    const groupedItems = computed(() => {
      const groups = ItemGroups.map((group) => ({ name: group.name, items: [] }))
      const groupMap = Object.fromEntries(groups.map((group) => [group.name, group]))

      props.itemList.forEach((item, index) => {
        const groupName = ITEM_GROUP_NAME_BY_ID[item.itemId] || '未分类'
        if (groupMap[groupName]) {
          groupMap[groupName].items.push({ ...item, _index: index })
        }
      })

      return groups.filter((group) => group.items.length > 0)
    })
    const { isReady, visibleCount: visibleGroupCount } = useDeferredTableRender(
      computed(() => groupedItems.value.length),
      { initialCount: 2, batchSize: 1, batchDelay: 24 }
    )

    const getItemName = (id) => ItemNames[id] || `物品#${id}`

    const columns = [
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
    ]

    return { columns, groupedItems, isReady, visibleGroupCount, tableHeight }
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

.group-loading-state {
  padding: 4px 0 8px;
}
</style>
