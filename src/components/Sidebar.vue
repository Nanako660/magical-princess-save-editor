<template>
  <n-menu
    :value="activeTab"
    :options="menuOptions"
    @update:value="handleUpdateValue"
    :disabled="!enabled"
  />
</template>

<script>
import { h } from 'vue'
import { NMenu, NIcon } from 'naive-ui'
import {
  BarChartOutline,
  TrendingUpOutline,
  ShieldOutline,
  PeopleOutline,
  BagOutline,
  StarOutline,
  SyncOutline,
  FlashOutline
} from '@vicons/ionicons5'

function renderIcon(icon) {
  return () => h(NIcon, null, { default: () => h(icon) })
}

export default {
  name: 'Sidebar',
  components: { NMenu },
  props: {
    activeTab: { type: String, default: 'basic' },
    enabled: { type: Boolean, default: true }
  },
  emits: ['update:activeTab'],
  setup(props, { emit }) {
    const menuOptions = [
      { key: 'basic', label: '基础属性', icon: renderIcon(BarChartOutline) },
      { key: 'detailed', label: '详细属性', icon: renderIcon(TrendingUpOutline) },
      { key: 'equipment', label: '装备', icon: renderIcon(ShieldOutline) },
      { key: 'npc', label: 'NPC', icon: renderIcon(PeopleOutline) },
      { key: 'items', label: '物品', icon: renderIcon(BagOutline) },
      { key: 'skills', label: '技能', icon: renderIcon(StarOutline) },
      { key: 'global', label: '轮回数据', icon: renderIcon(SyncOutline) },
      { key: 'quick', label: '快捷操作', icon: renderIcon(FlashOutline) }
    ]
    
    const handleUpdateValue = (key) => {
      if (props.enabled) {
        emit('update:activeTab', key)
      }
    }
    
    return {
      menuOptions,
      handleUpdateValue
    }
  }
}
</script>