import { computed } from 'vue'

/**
 * 快捷操作 Composable
 * 提供一键修改存档数据的功能
 */
export function useQuickActions(saveData) {
  
  /**
   * 一键满属性
   * 设置所有16项子属性为2000，等级为10
   */
  const maxAllStats = () => {
    if (!saveData.value) return
    
    const s = saveData.value.status
    
    // 四维等级
    s.levelPhysical = 10
    s.levelIntelligence = 10
    s.levelCharm = 10
    s.levelSense = 10
    
    // 体力子属性
    s.phyKinryoku = 2000
    s.phySeimei = 2000
    s.phyKonjyo = 2000
    s.phyBinsho = 2000
    
    // 智力子属性
    s.intBungaku = 2000
    s.intSanjyutsu = 2000
    s.intMajyutsu = 2000
    s.intShinkou = 2000
    
    // 魅力子属性
    s.chaBibou = 2000
    s.chaShakou = 2000
    s.chaReigi = 2000
    s.chaDoutoku = 2000
    
    // 感性子属性
    s.senSouzou = 2000
    s.senSousaku = 2000
    s.senOnkan = 2000
    s.senBikan = 2000
    
    // 战斗等级
    s.levelBattle = 10
    s.levelArts = 10
    s.levelMagic = 10
    
    return '属性已最大化！'
  }

  /**
   * 金钱最大化
   */
  const maxMoney = () => {
    if (!saveData.value) return
    saveData.value.status.money = 9999999
    return '金钱已最大化！'
  }

  /**
   * 压力清零
   */
  const clearStress = () => {
    if (!saveData.value) return
    saveData.value.status.stress = 0
    return '压力已清零！'
  }

  /**
   * 行动力全满
   */
  const maxActionPower = () => {
    if (!saveData.value) return
    saveData.value.status.activePower = 99
    saveData.value.status.activePowerMax = 99
    return '行动力已全满！'
  }

  /**
   * 全NPC满好感
   */
  const maxAllFavorability = () => {
    if (!saveData.value) return
    
    const list = saveData.value.friendDataParamList
    if (!list || list.length === 0) return '没有NPC数据'
    
    list.forEach(npc => {
      npc.fFavarite = 100
    })
    return '全部NPC好感度已最大化！'
  }

  /**
   * 解锁全部技能
   */
  const unlockAllSkills = () => {
    if (!saveData.value) return
    
    const list = saveData.value.skillDataParamList
    if (!list || list.length === 0) return '没有技能数据'
    
    list.forEach(skill => {
      skill.isOpened = true
      skill.isLearned = true
    })
    return '全部技能已解锁！'
  }

  /**
   * 跳到最终月
   */
  const setMonth42 = () => {
    if (!saveData.value) return
    saveData.value.status.period = 42
    return '已跳到最终月！'
  }

  /**
   * 重置到初始月
   */
  const resetToMonth0 = () => {
    if (!saveData.value) return
    saveData.value.status.period = 0
    return '已重置到初始月！'
  }

  /**
   * 黑币最大化
   */
  const maxBlackCoin = () => {
    if (!saveData.value) return
    saveData.value.status.blackCoin = 9999
    return '黑币已最大化！'
  }

  /**
   * 善行值最大化
   */
  const maxGoodAction = () => {
    if (!saveData.value) return
    saveData.value.status.goodAction = 100
    saveData.value.status.badAction = 1
    saveData.value.status.gbBalance = 99
    return '善行值已最大化！'
  }

  /**
   * 恶行值最大化
   */
  const maxBadAction = () => {
    if (!saveData.value) return
    saveData.value.status.goodAction = 1
    saveData.value.status.badAction = 100
    saveData.value.status.gbBalance = 1
    return '恶行值已最大化！'
  }

  /**
   * 执行快捷操作并返回提示信息
   */
  const executeAction = (action) => {
    const actions = {
      maxAllStats,
      maxMoney,
      clearStress,
      maxActionPower,
      maxAllFavorability,
      unlockAllSkills,
      setMonth42,
      resetToMonth0,
      maxBlackCoin,
      maxGoodAction,
      maxBadAction
    }
    
    const fn = actions[action]
    if (!fn) return '未知操作'
    
    return fn()
  }

  return {
    // 单个操作
    maxAllStats,
    maxMoney,
    clearStress,
    maxActionPower,
    maxAllFavorability,
    unlockAllSkills,
    setMonth42,
    resetToMonth0,
    maxBlackCoin,
    maxGoodAction,
    maxBadAction,
    
    // 统一执行接口
    executeAction
  }
}
