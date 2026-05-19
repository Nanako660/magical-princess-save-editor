<template>
  <section class="editor-section page-table">
    <h2 class="section-title">功绩</h2>

    <n-alert type="warning" size="small" class="acv-alert">
      修改功绩不确定是否会触发 Steam 成就，或导致游戏行为异常，请自行承担风险，建议先备份存档。
    </n-alert>

    <div class="list-controls acv-controls">
      <n-text depth="3" class="acv-count">已解锁 {{ unlockedCount }} / {{ ACHIEVEMENT_LIST.length }}</n-text>
      <n-space :size="8">
        <n-button size="small" type="primary" @click="unlockAll">全部解锁</n-button>
        <n-button size="small" type="error" ghost @click="clearAll">全部清空</n-button>
      </n-space>
    </div>

    <div class="table-panel table-panel--flat">
      <div v-if="!isReady" class="table-loading-state">
        <n-skeleton text :repeat="6" />
      </div>
      <n-data-table
        :columns="columns"
        :data="visibleList"
        :loading="!isReady"
        :max-height="tableHeight"
        size="small"
        virtual-scroll
        :row-key="(row) => row.id"
      />
    </div>
  </section>
</template>

<script>
import { h, computed, onMounted } from 'vue'
import { NText, NAlert, NSpace, NButton, NDataTable, NCheckbox, NSkeleton } from 'naive-ui'
import { AchievementNames, AchievementDescs } from '../data/gameData.js'
import { useViewportTableHeight } from '../composables/useViewportTableHeight.js'
import { useDeferredTableRender } from '../composables/useDeferredTableRender.js'

const ACHIEVEMENT_LIST = Object.keys(AchievementNames)
  .map((key) => Number(key))
  .sort((a, b) => a - b)
  .map((id) => ({
    id,
    name: AchievementNames[id] || `功绩#${id}`,
    desc: AchievementDescs[id] || ''
  }))

function normalizeIds(ids) {
  return [...new Set(ids)].sort((a, b) => a - b)
}

export default {
  name: 'AchievementEditor',
  components: { NText, NAlert, NSpace, NButton, NDataTable, NSkeleton },
  props: {
    gstatus: { type: Object, required: true }
  },
  setup(props) {
    onMounted(() => {
      if (!Array.isArray(props.gstatus.acvUnlockedIds)) {
        props.gstatus.acvUnlockedIds = []
      }
    })

    const { tableHeight } = useViewportTableHeight(280, 360)
    const { isReady, visibleCount } = useDeferredTableRender(
      computed(() => ACHIEVEMENT_LIST.length),
      { initialCount: 30, batchSize: 30 }
    )

    const unlockedSet = computed(() => new Set(props.gstatus.acvUnlockedIds || []))
    const unlockedCount = computed(() => unlockedSet.value.size)
    const visibleList = computed(() => ACHIEVEMENT_LIST.slice(0, visibleCount.value))

    const setUnlocked = (id, checked) => {
      const current = Array.isArray(props.gstatus.acvUnlockedIds) ? props.gstatus.acvUnlockedIds : []
      if (checked) {
        if (current.includes(id)) return
        props.gstatus.acvUnlockedIds = normalizeIds([...current, id])
      } else {
        if (!current.includes(id)) return
        props.gstatus.acvUnlockedIds = current.filter((x) => x !== id)
      }
    }

    const unlockAll = () => {
      props.gstatus.acvUnlockedIds = ACHIEVEMENT_LIST.map((a) => a.id)
    }

    const clearAll = () => {
      props.gstatus.acvUnlockedIds = []
    }

    const columns = [
      {
        title: '名称 (ID)',
        key: 'name',
        minWidth: 220,
        render(row) {
          return h('span', { class: 'acv-name' }, `${row.name} (#${row.id})`)
        }
      },
      {
        title: '描述',
        key: 'desc',
        minWidth: 280,
        render(row) {
          return h('span', { class: 'acv-desc' }, row.desc || '—')
        }
      },
      {
        title: '已解锁',
        key: 'unlocked',
        width: 96,
        render(row) {
          return h(NCheckbox, {
            checked: unlockedSet.value.has(row.id),
            'onUpdate:checked': (v) => setUnlocked(row.id, v)
          })
        }
      }
    ]

    return {
      ACHIEVEMENT_LIST,
      columns,
      visibleList,
      unlockedCount,
      isReady,
      tableHeight,
      unlockAll,
      clearAll
    }
  }
}
</script>

<style scoped>
.acv-alert {
  margin-bottom: 12px;
}

.acv-controls {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
}

.acv-count {
  font-size: 0.9rem;
  white-space: nowrap;
}

.table-panel--flat {
  min-height: 0;
}

.table-loading-state {
  padding: 12px 0 4px;
}

.acv-desc {
  color: #94a3b8;
  font-size: 0.85rem;
}
</style>
