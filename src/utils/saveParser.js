import { decrypt, encrypt } from '../composables/useCrypto.js'
import { 
  StatusKeyMap, 
  GlobalStatusKeyMap, 
  FriendKeyMap, 
  ItemKeyMap, 
  SkillKeyMap,
  BattleArtsKeyMap,
  ActivityKeyMap,
  CurriculumKeyMap,
  ConfigKeyMap,
  StatusKeyMapReverse,
  GlobalStatusKeyMapReverse,
  FriendKeyMapReverse,
  ItemKeyMapReverse,
  SkillKeyMapReverse,
  BattleArtsKeyMapReverse,
  ActivityKeyMapReverse,
  CurriculumKeyMapReverse,
  ConfigKeyMapReverse
} from '../data/keyMap.js'
import { getPeriodData } from '../data/periodData.js'

// 将JSON简短键转换为完整字段名
function expandKeys(obj, keyMap) {
  if (!obj || typeof obj !== 'object') return obj
  if (Array.isArray(obj)) {
    return obj.map(item => expandKeys(item, keyMap))
  }
  
  const result = {}
  for (const [key, value] of Object.entries(obj)) {
    const fullKey = keyMap[key] || key
    if (typeof value === 'object' && value !== null) {
      result[fullKey] = expandKeys(value, keyMap)
    } else {
      result[fullKey] = value
    }
  }
  return result
}

// 将完整字段名转换为JSON简短键（只保留在forwardKeyMap中存在的键）
function compressKeys(obj, reverseKeyMap, forwardKeyMap) {
  if (!obj || typeof obj !== 'object') return obj
  if (Array.isArray(obj)) {
    return obj.map(item => compressKeys(item, reverseKeyMap, forwardKeyMap))
  }
  
  const validFullKeys = new Set(Object.values(forwardKeyMap))
  const result = {}
  for (const [key, value] of Object.entries(obj)) {
    if (!validFullKeys.has(key)) continue
    const shortKey = reverseKeyMap[key] || key
    if (typeof value === 'object' && value !== null) {
      result[shortKey] = compressKeys(value, reverseKeyMap, forwardKeyMap)
    } else {
      result[shortKey] = value
    }
  }
  return result
}

// 解析存档文件
export function parseSaveFile(base64Content) {
  try {
    const jsonStr = decrypt(base64Content)
    const rawData = JSON.parse(jsonStr)
    
    // 将简短键转换为完整字段名
    const data = {
      ...rawData,
      status: expandKeys(rawData.status || {}, StatusKeyMap),
      gstatus: expandKeys(rawData.gstatus || {}, GlobalStatusKeyMap),
      friendDataParamList: (rawData.friendDataParamList || []).map(f => expandKeys(f, FriendKeyMap)),
      itemDataParamList: (rawData.itemDataParamList || []).map(i => expandKeys(i, ItemKeyMap)),
      skillDataParamList: (rawData.skillDataParamList || []).map(s => expandKeys(s, SkillKeyMap)),
      battleArtsDataParamList: (rawData.battleArtsDataParamList || []).map(b => expandKeys(b, BattleArtsKeyMap)),
      activityDataParamList: (rawData.activityDataParamList || []).map(a => expandKeys(a, ActivityKeyMap)),
      curriculumDataParamList: (rawData.curriculumDataParamList || []).map(c => expandKeys(c, CurriculumKeyMap))
    }
    
    return normalizeSaveData(data)
  } catch (e) {
    console.error('Parse error:', e)
    throw new Error('存档解析失败：' + e.message)
  }
}

// 解析用户设置文件
export function parseConfigFile(base64Content) {
  try {
    const jsonStr = decrypt(base64Content)
    const rawData = JSON.parse(jsonStr)
    return expandKeys(rawData, ConfigKeyMap)
  } catch (e) {
    console.error('Parse config error:', e)
    throw new Error('设置解析失败：' + e.message)
  }
}

// 规范化存档数据（确保所有字段存在）
function normalizeSaveData(data) {
  // 确保基本结构存在
  if (!data.gstatus) data.gstatus = {}
  if (!data.status) data.status = {}
  if (!data.friendDataParamList) data.friendDataParamList = []
  if (!data.itemDataParamList) data.itemDataParamList = []
  if (!data.skillDataParamList) data.skillDataParamList = []
  if (!data.battleArtsDataParamList) data.battleArtsDataParamList = []
  if (!data.activityDataParamList) data.activityDataParamList = []
  if (!data.curriculumDataParamList) data.curriculumDataParamList = []
  if (!data.flagEventReaded) data.flagEventReaded = []
  if (!data.flagEventReadedMonth) data.flagEventReadedMonth = []
  if (!data.statusDataHistory) data.statusDataHistory = []
  
  return data
}

// 序列化存档文件
export function serializeSaveFile(data) {
  try {
    // 深拷贝去除 Vue 响应式 Proxy
    const plain = JSON.parse(JSON.stringify(data))
    
    // 将完整字段名转换回简短键，只保留游戏已知字段
    const rawData = {
      ...plain,
      status: compressKeys(plain.status, StatusKeyMapReverse, StatusKeyMap),
      gstatus: compressKeys(plain.gstatus, GlobalStatusKeyMapReverse, GlobalStatusKeyMap),
      friendDataParamList: (plain.friendDataParamList || []).map(f => compressKeys(f, FriendKeyMapReverse, FriendKeyMap)),
      itemDataParamList: (plain.itemDataParamList || []).map(i => compressKeys(i, ItemKeyMapReverse, ItemKeyMap)),
      skillDataParamList: (plain.skillDataParamList || []).map(s => compressKeys(s, SkillKeyMapReverse, SkillKeyMap)),
      battleArtsDataParamList: (plain.battleArtsDataParamList || []).map(b => compressKeys(b, BattleArtsKeyMapReverse, BattleArtsKeyMap)),
      activityDataParamList: (plain.activityDataParamList || []).map(a => compressKeys(a, ActivityKeyMapReverse, ActivityKeyMap)),
      curriculumDataParamList: (plain.curriculumDataParamList || []).map(c => compressKeys(c, CurriculumKeyMapReverse, CurriculumKeyMap))
    }
    
    const jsonStr = JSON.stringify(rawData)
    return encrypt(jsonStr)
  } catch (e) {
    console.error('Serialize error:', e)
    throw new Error('存档序列化失败：' + e.message)
  }
}

// 序列化用户设置文件
export function serializeConfigFile(data) {
  try {
    const plain = JSON.parse(JSON.stringify(data))
    const rawData = compressKeys(plain, ConfigKeyMapReverse, ConfigKeyMap)
    const jsonStr = JSON.stringify(rawData)
    return encrypt(jsonStr)
  } catch (e) {
    console.error('Serialize config error:', e)
    throw new Error('设置序列化失败：' + e.message)
  }
}

// 获取月份显示文本 (与游戏逻辑一致)
export function getPeriodText(period) {
  if (period < 0) return '未开始'
  
  const data = getPeriodData(period)
  if (!data) return `未知(${period})`
  
  // period=42 是毕业
  if (period === 42) return '毕业'
  
  // 童年期显示"童年 X月"
  if (data.isChildhood) {
    return `童年 ${data.month}月`
  }
  
  // 学院期显示"X年级 X月"
  return `${data.year}年级 ${data.month}月`
}

// 获取属性分类 (从游戏本地化数据同步)
export function getAttributeCategories() {
  return {
    basic: {
      title: '基础资源',
      fields: ['stress', 'money', 'blackCoin', 'activePower', 'activePowerMax']
    },
    balance: {
      title: '善恶',
      fields: ['goodAction', 'badAction', 'gbBalance']
    },
    physical: {
      title: '体力',
      fields: ['levelPhysical', 'valuePhysical', 'phyKinryoku', 'phySeimei', 'phyKonjyo', 'phyBinsho']
    },
    intelligence: {
      title: '智力',
      fields: ['levelIntelligence', 'valueIntelligence', 'intBungaku', 'intSanjyutsu', 'intMajyutsu', 'intShinkou']
    },
    charm: {
      title: '魅力',
      fields: ['levelCharm', 'valueCharm', 'chaBibou', 'chaShakou', 'chaReigi', 'chaDoutoku']
    },
    sense: {
      title: '感性',
      fields: ['levelSense', 'valueSense', 'senSouzou', 'senSousaku', 'senOnkan', 'senBikan']
    },
    battle: {
      title: '战斗',
      fields: ['levelBattle', 'levelArts', 'levelMagic', 'btlExp']
    }
  }
}
