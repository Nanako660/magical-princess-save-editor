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
      {
        type: 'group',
        label: '首页',
        key: 'group-home',
        children: [
          { key: 'quick', label: '首页', icon: renderIcon(HomeOutline) }
        ]
      },
      {
        type: 'group',
        label: '角色编辑',
        key: 'group-character',
        children: [
          { key: 'basic', label: '基础属性', icon: renderIcon(BarChartOutline) },
          { key: 'detailed', label: '详细属性', icon: renderIcon(TrendingUpOutline) },
          { key: 'equipment', label: '装备', icon: renderIcon(ShieldOutline) },
          { key: 'npc', label: 'NPC', icon: renderIcon(PeopleOutline) }
        ]
      },
      {
        type: 'group',
        label: '列表编辑',
        key: 'group-lists',
        children: [
          { key: 'items', label: '物品', icon: renderIcon(BagOutline) },
          { key: 'skills', label: '技能', icon: renderIcon(StarOutline) },
          { key: 'battlearts', label: '战斗技能', icon: renderIcon(FlashOutline) },
          { key: 'activity', label: '活动', icon: renderIcon(CalendarOutline) },
          { key: 'curriculum', label: '课程', icon: renderIcon(BookOutline) }
        ]
      },
      {
        type: 'group',
        label: '其它',
        key: 'group-other',
        children: [
          { key: 'global', label: '轮回数据', icon: renderIcon(SyncOutline) },
          { key: 'config', label: '用户设置', icon: renderIcon(SettingsOutline) }
        ]
      }
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
