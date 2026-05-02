/**
 * 数据验证工具
 */

import { MAX_VALUES, MIN_VALUES } from '../data/constants.js'

/**
 * 验证并限制数值范围
 * @param {number} value - 输入值
 * @param {number} min - 最小值
 * @param {number} max - 最大值
 * @returns {number} 限制后的值
 */
export function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value))
}

/**
 * 验证压力值 (0-100)
 */
export function validateStress(value) {
  return clamp(value, MIN_VALUES.stress, MAX_VALUES.stress)
}

/**
 * 验证金钱值
 */
export function validateMoney(value) {
  return clamp(value, MIN_VALUES.money, MAX_VALUES.money)
}

/**
 * 验证等级值 (1-18)
 */
export function validateLevel(value) {
  return clamp(value, MIN_VALUES.level, MAX_VALUES.levelPhysical)
}

/**
 * 验证子属性值
 */
export function validateSubStat(value) {
  return clamp(value, MIN_VALUES.subStat, MAX_VALUES.phyKinryoku)
}

/**
 * 验证好感度值 (0-100)
 */
export function validateFavorability(value) {
  return clamp(value, 0, MAX_VALUES.fFavarite)
}

/**
 * 验证善恶平衡值 (0-100)
 */
export function validateGBBalance(value) {
  return clamp(value, MIN_VALUES.gbBalance, MAX_VALUES.gbBalance)
}

/**
 * 验证善行/恶行值 (最小值为1)
 */
export function validateAction(value) {
  return Math.max(MIN_VALUES.goodAction, value)
}

/**
 * 验证月份值 (0-42)
 */
export function validatePeriod(value) {
  return clamp(value, 0, MAX_VALUES.period)
}

/**
 * 验证恋爱事件次数 (0-4)
 */
export function validateLoveEvents(value) {
  return clamp(value, 0, MAX_VALUES.fLoveEvents)
}

/**
 * 验证生日月 (1-12)
 */
export function validateBirthMonth(value) {
  return clamp(value, 1, 12)
}

/**
 * 验证生日日 (1-31)
 */
export function validateBirthDay(value) {
  return clamp(value, 1, 31)
}

/**
 * 验证整个存档数据
 * @param {Object} data - 存档数据
 * @returns {Object} 验证后的数据
 */
export function validateSaveData(data) {
  if (!data || !data.status) return data
  
  const s = data.status
  
  // 验证基础属性
  s.stress = validateStress(s.stress)
  s.money = validateMoney(s.money)
  s.period = validatePeriod(s.period)
  s.gbBalance = validateGBBalance(s.gbBalance)
  s.goodAction = validateAction(s.goodAction)
  s.badAction = validateAction(s.badAction)
  
  // 验证等级
  s.levelPhysical = validateLevel(s.levelPhysical)
  s.levelIntelligence = validateLevel(s.levelIntelligence)
  s.levelCharm = validateLevel(s.levelCharm)
  s.levelSense = validateLevel(s.levelSense)
  s.levelBattle = validateLevel(s.levelBattle)
  s.levelArts = validateLevel(s.levelArts)
  s.levelMagic = validateLevel(s.levelMagic)
  
  // 验证子属性
  s.phyKinryoku = validateSubStat(s.phyKinryoku)
  s.phySeimei = validateSubStat(s.phySeimei)
  s.phyKonjyo = validateSubStat(s.phyKonjyo)
  s.phyBinsho = validateSubStat(s.phyBinsho)
  s.intBungaku = validateSubStat(s.intBungaku)
  s.intSanjyutsu = validateSubStat(s.intSanjyutsu)
  s.intMajyutsu = validateSubStat(s.intMajyutsu)
  s.intShinkou = validateSubStat(s.intShinkou)
  s.chaBibou = validateSubStat(s.chaBibou)
  s.chaShakou = validateSubStat(s.chaShakou)
  s.chaReigi = validateSubStat(s.chaReigi)
  s.chaDoutoku = validateSubStat(s.chaDoutoku)
  s.senSouzou = validateSubStat(s.senSouzou)
  s.senSousaku = validateSubStat(s.senSousaku)
  s.senOnkan = validateSubStat(s.senOnkan)
  s.senBikan = validateSubStat(s.senBikan)
  
  // 验证NPC好感度
  if (data.friendDataParamList) {
    data.friendDataParamList.forEach(npc => {
      npc.fFavarite = validateFavorability(npc.fFavarite)
      npc.fLoveEvents = validateLoveEvents(npc.fLoveEvents)
    })
  }
  
  // 验证跨轮回数据
  if (data.gstatus) {
    const g = data.gstatus
    g.playerBirthDay = validateBirthMonth(g.playerBirthDay)
    g.playerBirthDayDate = validateBirthDay(g.playerBirthDayDate)
    g.fatherBirthDay = validateBirthMonth(g.fatherBirthDay)
    g.fatherBirthDayDate = validateBirthDay(g.fatherBirthDayDate)
  }
  
  return data
}
