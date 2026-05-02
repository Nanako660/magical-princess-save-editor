import { decrypt, encrypt } from '../composables/useCrypto.js'
import { CharaType, LocationType, AcademyClass, SituationType } from '../data/enums.js'
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
  DeviceKeyMap,
  IndexParamsKeyMap,
  StatusKeyMapReverse,
  GlobalStatusKeyMapReverse,
  FriendKeyMapReverse,
  ItemKeyMapReverse,
  SkillKeyMapReverse,
  BattleArtsKeyMapReverse,
  ActivityKeyMapReverse,
  CurriculumKeyMapReverse,
  ConfigKeyMapReverse,
  DeviceKeyMapReverse,
  IndexParamsKeyMapReverse
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

// 解析存档索引文件
export function parseIndexFile(base64Content) {
  try {
    const jsonStr = decrypt(base64Content)
    const rawData = JSON.parse(jsonStr)
    
    return {
      ...rawData,
      dataList: (rawData.dataList || []).map(p => expandKeys(p, IndexParamsKeyMap))
    }
  } catch (e) {
    console.error('Parse index error:', e)
    throw new Error('索引解析失败：' + e.message)
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

// 解析设备设置文件
export function parseDeviceFile(base64Content) {
  try {
    const jsonStr = decrypt(base64Content)
    const rawData = JSON.parse(jsonStr)
    return expandKeys(rawData, DeviceKeyMap)
  } catch (e) {
    console.error('Parse device error:', e)
    throw new Error('设备设置解析失败：' + e.message)
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

// 序列化存档索引文件
export function serializeIndexFile(data) {
  try {
    const plain = JSON.parse(JSON.stringify(data))
    const rawData = {
      ...plain,
      dataList: (plain.dataList || []).map(p => compressKeys(p, IndexParamsKeyMapReverse, IndexParamsKeyMap))
    }
    const jsonStr = JSON.stringify(rawData)
    return encrypt(jsonStr)
  } catch (e) {
    console.error('Serialize index error:', e)
    throw new Error('索引序列化失败：' + e.message)
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

// 序列化设备设置文件
export function serializeDeviceFile(data) {
  try {
    const plain = JSON.parse(JSON.stringify(data))
    const rawData = compressKeys(plain, DeviceKeyMapReverse, DeviceKeyMap)
    const jsonStr = JSON.stringify(rawData)
    return encrypt(jsonStr)
  } catch (e) {
    console.error('Serialize device error:', e)
    throw new Error('设备设置序列化失败：' + e.message)
  }
}

// 根据存档数据更新索引条目
export function buildIndexParamsFromSaveData(saveData, slotId) {
  const status = saveData.status || {}
  const gstatus = saveData.gstatus || {}
  
  return {
    isPlaying: true,
    isNextLoopStart: gstatus.isNextLoopStart || false,
    saveSlotId: slotId,
    loopCount: gstatus.loopCount || 1,
    period: status.period || 0,
    playerName: gstatus.playerName || '',
    date: new Date().toISOString(),
    levelPhysical: status.levelPhysical || 1,
    levelIntelligence: status.levelIntelligence || 1,
    levelCharm: status.levelCharm || 1,
    levelSense: status.levelSense || 1,
    levelBattle: status.levelBattle || 1,
    levelArts: status.levelArts || 1,
    levelMagic: status.levelMagic || 1,
    acClass: status.acClass || 0,
    charaFav: -1,
    location: saveData.location || 0,
    situation: saveData.situation || 0
  }
}

// 创建新的存档数据 (从游戏本地化数据同步)
export function createEmptySaveData() {
  return {
    saveSlotId: 0,
    period: 0,
    acClass: AcademyClass.NONE,
    gstatus: {
      userId: 0,
      loopCount: 1,
      saveSlotId: 0,
      playerName: '爱丽丝',
      fatherName: '马克',
      fatherGivenName: '爸爸',
      playerBirthDay: 5,
      playerBirthDayDate: 4,
      fatherBirthDay: 1,
      fatherBirthDayDate: 27,
      isShowTrueEnding: false,
      isShowAnotherEnding: false,
      isNextLoopStart: false,
      cornetMaxFav: 0,
      cornetMaxLoveEvent: 0,
      isCoupledCrowa: false,
      isCoupledChocola: false,
      isCoupledFran: false,
      isCoupledCornet: false,
      isCoupledShaile: false,
      isCoupledHasis: false,
      isCoupledNoah: false,
      acvPoint: 0,
      acvUnlockedIds: [],
      acvGettedItemIds: [],
      acvCraftedItemIds: [],
      acvFriendshipEventIds: [],
      acvFamilyTripEventIds: [],
      acvCrimeEventIds: []
    },
    status: {
      period: 0,
      stress: 0,
      money: 500,
      blackCoin: 0,
      activePower: 10,
      goodAction: 50,
      badAction: 50,
      gbBalance: 50,
      fatherFavarite: 0,
      reputation: 0,
      acClass: 1,
      skillPoint: 0,
      equipCloth: -1,
      equipWeapon: -1,
      equipArmor: -1,
      levelPhysical: 1,
      levelIntelligence: 1,
      levelCharm: 1,
      levelSense: 1,
      levelBattle: 1,
      levelArts: 1,
      levelMagic: 1,
      fatherFavLevel: 1,
      valuePhysical: 0,
      valueIntelligence: 0,
      valueCharm: 0,
      valueSense: 0,
      phyKinryoku: 5,
      phySeimei: 5,
      phyKonjyo: 5,
      phyBinsho: 5,
      intBungaku: 5,
      intSanjyutsu: 5,
      intMajyutsu: 5,
      intShinkou: 5,
      chaBibou: 5,
      chaShakou: 5,
      chaReigi: 5,
      chaDoutoku: 5,
      senSouzou: 5,
      senSousaku: 5,
      senOnkan: 5,
      senBikan: 5,
      btlExp: 0
    },
    statusDataHistory: [],
    flagEventReaded: [],
    flagEventReadedMonth: [],
    location: LocationType.NONE,
    situation: SituationType.DAY,
    friendDataParamList: [],
    itemDataParamList: [],
    skillDataParamList: [],
    battleArtsDataParamList: [],
    activityDataParamList: [],
    curriculumDataParamList: []
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
