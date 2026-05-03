<template>
  <n-menu
    :value="activeTab"
    :options="menuOptions"
    @update:value="handleUpdateValue"
  />
</template>

<script>
import { h } from 'vue'
import { NMenu, NIcon } from 'naive-ui'
import {
  HomeOutline,
  BarChartOutline,
  TrendingUpOutline,
  ShieldOutline,
  PeopleOutline,
  BagOutline,
  StarOutline,
  SyncOutline,
  SettingsOutline,
  FlashOutline,
  CalendarOutline,
  BookOutline
} from '@vicons/ionicons5'

function renderIcon(icon) {
  return () => h(NIcon, null, { default: () => h(icon) })
}

export default {
  name: 'Sidebar',
  components: { NMenu },
  props: {
    activeTab: { type: String, default: 'basic' }
  },
  emits: ['update:activeTab'],
  setup(_, { emit }) {
    const menuOptions = [
      { key: 'quick', label: '首页', icon: renderIcon(HomeOutline) },
      { key: 'basic', label: '基础属性', icon: renderIcon(BarChartOutline) },
      { key: 'detailed', label: '详细属性', icon: renderIcon(TrendingUpOutline) },
      { key: 'equipment', label: '装备', icon: renderIcon(ShieldOutline) },
      { key: 'npc', label: 'NPC', icon: renderIcon(PeopleOutline) },
      { key: 'items', label: '物品', icon: renderIcon(BagOutline) },
      { key: 'skills', label: '技能', icon: renderIcon(StarOutline) },
      { key: 'global', label: '轮回数据', icon: renderIcon(SyncOutline) },
      { key: 'battlearts', label: '战斗技能', icon: renderIcon(FlashOutline) },
      { key: 'activity', label: '活动', icon: renderIcon(CalendarOutline) },
      { key: 'curriculum', label: '课程', icon: renderIcon(BookOutline) },
      { key: 'config', label: '用户设置', icon: renderIcon(SettingsOutline) }
    ]
    
    const handleUpdateValue = (key) => {
      emit('update:activeTab', key)
    }
    
    return {
      menuOptions,
      handleUpdateValue
    }
  }
}
</script>
