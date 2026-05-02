import { decrypt, encrypt } from '../composables/useCrypto.js'
import { CharaType, LocationType, AcademyClass, SituationType } from '../data/enums.js'
import { 
  StatusKeyMap, 
  GlobalStatusKeyMap, 
  FriendKeyMap, 
  ItemKeyMap, 
  SkillKeyMap 
} from '../data/keyMap.js'

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

// 将完整字段名转换为JSON简短键
function compressKeys(obj, reverseKeyMap) {
  if (!obj || typeof obj !== 'object') return obj
  if (Array.isArray(obj)) {
    return obj.map(item => compressKeys(item, reverseKeyMap))
  }
  
  const result = {}
  for (const [key, value] of Object.entries(obj)) {
    const shortKey = reverseKeyMap[key] || key
    if (typeof value === 'object' && value !== null) {
      result[shortKey] = compressKeys(value, reverseKeyMap)
    } else {
      result[shortKey] = value
    }
  }
  return result
}

// 创建反向映射
const StatusKeyMapReverse = Object.fromEntries(
  Object.entries(StatusKeyMap).map(([k, v]) => [v, k])
)
const GlobalStatusKeyMapReverse = Object.fromEntries(
  Object.entries(GlobalStatusKeyMap).map(([k, v]) => [v, k])
)
const FriendKeyMapReverse = Object.fromEntries(
  Object.entries(FriendKeyMap).map(([k, v]) => [v, k])
)
const ItemKeyMapReverse = Object.fromEntries(
  Object.entries(ItemKeyMap).map(([k, v]) => [v, k])
)
const SkillKeyMapReverse = Object.fromEntries(
  Object.entries(SkillKeyMap).map(([k, v]) => [v, k])
)

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
      skillDataParamList: (rawData.skillDataParamList || []).map(s => expandKeys(s, SkillKeyMap))
    }
    
    return normalizeSaveData(data)
  } catch (e) {
    console.error('Parse error:', e)
    throw new Error('存档解析失败：' + e.message)
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
    // 将完整字段名转换回简短键
    const rawData = {
      ...data,
      status: compressKeys(data.status, StatusKeyMapReverse),
      gstatus: compressKeys(data.gstatus, GlobalStatusKeyMapReverse),
      friendDataParamList: data.friendDataParamList.map(f => compressKeys(f, FriendKeyMapReverse)),
      itemDataParamList: data.itemDataParamList.map(i => compressKeys(i, ItemKeyMapReverse)),
      skillDataParamList: data.skillDataParamList.map(s => compressKeys(s, SkillKeyMapReverse))
    }
    
    const jsonStr = JSON.stringify(rawData)
    return encrypt(jsonStr)
  } catch (e) {
    console.error('Serialize error:', e)
    throw new Error('存档序列化失败：' + e.message)
  }
}

// 创建新的存档数据
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

// 获取月份显示文本
export function getPeriodText(period) {
  if (period < 0) return '未开始'
  if (period <= 5) return `童年期 第${period}月`
  const year = Math.floor((period - 6) / 4) + 1
  const month = ((period - 6) % 4) + 1
  return `学院期 第${year}年${month}月`
}

// 获取属性分类
export function getAttributeCategories() {
  return {
    basic: {
      title: '基础资源',
      fields: ['stress', 'money', 'blackCoin', 'activePower', 'activePowerMax']
    },
    balance: {
      title: '善恶平衡',
      fields: ['goodAction', 'badAction', 'gbBalance']
    },
    physical: {
      title: '体力属性',
      fields: ['levelPhysical', 'valuePhysical', 'phyKinryoku', 'phySeimei', 'phyKonjyo', 'phyBinsho']
    },
    intelligence: {
      title: '智力属性',
      fields: ['levelIntelligence', 'valueIntelligence', 'intBungaku', 'intSanjyutsu', 'intMajyutsu', 'intShinkou']
    },
    charm: {
      title: '魅力属性',
      fields: ['levelCharm', 'valueCharm', 'chaBibou', 'chaShakou', 'chaReigi', 'chaDoutoku']
    },
    sense: {
      title: '感性属性',
      fields: ['levelSense', 'valueSense', 'senSouzou', 'senSousaku', 'senOnkan', 'senBikan']
    },
    battle: {
      title: '战斗属性',
      fields: ['levelBattle', 'levelArts', 'levelMagic', 'btlExp']
    }
  }
}
