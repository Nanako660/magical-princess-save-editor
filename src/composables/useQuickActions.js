import { computed } from 'vue'

export function useQuickActions(saveData) {
  
  const maxAllStats = () => {
    if (!saveData.value) return null
    const s = saveData.value.status
    s.levelPhysical = 10; s.levelIntelligence = 10; s.levelCharm = 10; s.levelSense = 10
    s.phyKinryoku = 2000; s.phySeimei = 2000; s.phyKonjyo = 2000; s.phyBinsho = 2000
    s.intBungaku = 2000; s.intSanjyutsu = 2000; s.intMajyutsu = 2000; s.intShinkou = 2000
    s.chaBibou = 2000; s.chaShakou = 2000; s.chaReigi = 2000; s.chaDoutoku = 2000
    s.senSouzou = 2000; s.senSousaku = 2000; s.senOnkan = 2000; s.senBikan = 2000
    s.levelBattle = 10; s.levelArts = 10; s.levelMagic = 10; s.btlExp = 8000
    return {
      message: '属性已最大化！',
      fields: ['体力/智力/魅力/感性等级 → 10', '16项子属性 → 2000', '战斗/技能/魔法等级 → 10', '战斗经验 → 8000']
    }
  }

  const maxMoney = () => {
    if (!saveData.value) return null
    saveData.value.status.money = 9999999
    return { message: '金钱已最大化！', fields: ['金钱 → 9,999,999'] }
  }

  const clearStress = () => {
    if (!saveData.value) return null
    saveData.value.status.stress = 0
    return { message: '压力已清零！', fields: ['压力 → 0'] }
  }

  const maxActionPower = () => {
    if (!saveData.value) return null
    saveData.value.status.activePower = 99
    saveData.value.status.activePowerMax = 99
    return { message: '行动力已全满！', fields: ['行动力 → 99', '最大行动力 → 99'] }
  }

  const maxAllFavorability = () => {
    if (!saveData.value) return null
    const list = saveData.value.friendDataParamList
    if (!list || list.length === 0) return { message: '没有NPC数据', fields: [] }
    list.forEach(npc => { npc.fFavarite = 100 })
    return { message: '全部NPC好感度已最大化！', fields: [`${list.length}个NPC 好感度 → 100`] }
  }

  const unlockAllSkills = () => {
    if (!saveData.value) return null
    const list = saveData.value.skillDataParamList
    if (!list || list.length === 0) return { message: '没有技能数据', fields: [] }
    list.forEach(skill => { skill.isOpened = true; skill.isLearned = true })
    return { message: '全部技能已解锁！', fields: [`${list.length}个技能 → 已解锁已学习`] }
  }

  const setMonth42 = () => {
    if (!saveData.value) return null
    const old = saveData.value.status.period
    saveData.value.status.period = 42
    return { message: '已跳到最终月！', fields: [`月份: ${old} → 42`] }
  }

  const resetToMonth0 = () => {
    if (!saveData.value) return null
    const old = saveData.value.status.period
    saveData.value.status.period = 0
    return { message: '已重置到初始月！', fields: [`月份: ${old} → 0`] }
  }

  const maxBlackCoin = () => {
    if (!saveData.value) return null
    saveData.value.status.blackCoin = 9999
    return { message: '东亚硬币已最大化！', fields: ['东亚硬币 → 9999'] }
  }

  const maxGoodAction = () => {
    if (!saveData.value) return null
    saveData.value.status.goodAction = 100
    saveData.value.status.badAction = 1
    saveData.value.status.gbBalance = 99
    return { message: '善行已最大化！', fields: ['善行 → 100', '恶行 → 1', '善恶 → 99'] }
  }

  const maxBadAction = () => {
    if (!saveData.value) return null
    saveData.value.status.goodAction = 1
    saveData.value.status.badAction = 100
    saveData.value.status.gbBalance = 1
    return { message: '恶行已最大化！', fields: ['善行 → 1', '恶行 → 100', '善恶 → 1'] }
  }

  const ACTIONS = {
    maxAllStats: {
      label: '一键满属性', fn: maxAllStats,
      fields: ['体力/智力/魅力/感性等级 → 10', '16项子属性 → 2000', '战斗/技能/魔法等级 → 10', '战斗经验 → 8000']
    },
    maxMoney: {
      label: '金钱最大化', fn: maxMoney,
      fields: ['金钱 → 9,999,999']
    },
    clearStress: {
      label: '压力清零', fn: clearStress,
      fields: ['压力 → 0']
    },
    maxActionPower: {
      label: '行动力全满', fn: maxActionPower,
      fields: ['行动力 → 99', '最大行动力 → 99']
    },
    maxAllFavorability: {
      label: '全NPC满好感', fn: maxAllFavorability,
      fields: ['全部NPC 好感度 → 100']
    },
    unlockAllSkills: {
      label: '解锁全部技能', fn: unlockAllSkills,
      fields: ['全部技能 → 已解锁已学习']
    },
    setMonth42: {
      label: '跳到最终月', fn: setMonth42,
      fields: ['月份 → 42']
    },
    resetToMonth0: {
      label: '重置到初始月', fn: resetToMonth0,
      fields: ['月份 → 0']
    },
    maxBlackCoin: {
      label: '东亚硬币最大化', fn: maxBlackCoin,
      fields: ['东亚硬币 → 9999']
    },
    maxGoodAction: {
      label: '善行最大化', fn: maxGoodAction,
      fields: ['善行 → 100', '恶行 → 1', '善恶 → 99']
    },
    maxBadAction: {
      label: '恶行最大化', fn: maxBadAction,
      fields: ['善行 → 1', '恶行 → 100', '善恶 → 1']
    }
  }

  const getActionInfo = (action) => {
    const a = ACTIONS[action]
    if (!a) return null
    return { label: a.label, fields: a.fields }
  }

  const executeAction = (action) => {
    const info = ACTIONS[action]
    if (!info) return null
    return info.fn()
  }

  return {
    getActionInfo, executeAction
  }
}
