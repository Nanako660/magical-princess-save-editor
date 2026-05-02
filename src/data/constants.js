// 存档槽位总数
export const SAVE_SLOT_TOTAL = 31

// 文件名模板
export const FILE_NAMES = {
  INDEX: '/v10_indexdata.dat',
  USER_DATA: '/v10_userdata%N.dat',
  CONFIG: '/v10_configdata.dat',
  DEVICE: '/v10_devicedata.cfg'
}

// 默认属性值
export const DEFAULT_STATUS = {
  stress: 0,
  money: 500,
  blackCoin: 0,
  activePower: 10,
  activePowerMax: 10,
  goodAction: 50,
  badAction: 50,
  gbBalance: 50,
  levelPhysical: 1,
  levelIntelligence: 1,
  levelCharm: 1,
  levelSense: 1,
  levelBattle: 1,
  levelArts: 1,
  levelMagic: 1,
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
  senBikan: 5
}

// 属性上限（基于游戏代码）
export const MAX_VALUES = {
  // 基础资源
  stress: 100,                    // Mathf.Clamp(stress, 0, 100)
  money: 9999999,                 // 无硬性上限，设置合理最大值
  blackCoin: 9999,                // 无硬性上限，设置合理最大值
  activePower: 99,                // 动态上限，设置最大值
  activePowerMax: 99,             // 技能可提升
  
  // 善恶值（最小值为1）
  goodAction: 999999,             // Mathf.Max(1, goodAction)
  badAction: 999999,              // Mathf.Max(1, badAction)
  gbBalance: 100,                 // Mathf.Clamp(gbBalance, 0, 100)
  
  // 四维等级（1-18）
  levelPhysical: 18,              // maxLevel = 18
  levelIntelligence: 18,
  levelCharm: 18,
  levelSense: 18,
  
  // 战斗等级
  levelBattle: 18,
  levelArts: 18,
  levelMagic: 18,
  
  // 父亲好感等级（1-7）
  fatherFavLevel: 7,              // maxFamilytLevel = 7
  
  // 四维经验（无硬性上限，由子属性总和计算）
  valuePhysical: 9999,
  valueIntelligence: 9999,
  valueCharm: 9999,
  valueSense: 9999,
  
  // 16项子属性（无硬性上限，设置合理最大值）
  phyKinryoku: 999,
  phySeimei: 999,
  phyKonjyo: 999,
  phyBinsho: 999,
  intBungaku: 999,
  intSanjyutsu: 999,
  intMajyutsu: 999,
  intShinkou: 999,
  chaBibou: 999,
  chaShakou: 999,
  chaReigi: 999,
  chaDoutoku: 999,
  senSouzou: 999,
  senSousaku: 999,
  senOnkan: 999,
  senBikan: 999,
  
  // NPC好感度
  fFavarite: 100,                 // 好感度上限100
  fLoveEvents: 4,                 // 恋爱事件最大4
  
  // 其他
  period: 42,                     // 最大42个月
  fatherFavarite: 100,            // 父亲好感度
  reputation: 9999,
  skillPoint: 9999,
  btlExp: 99999
}

// 属性最小值
export const MIN_VALUES = {
  stress: 0,
  money: 0,
  blackCoin: 0,
  activePower: 0,
  goodAction: 1,                  // Mathf.Max(1, goodAction)
  badAction: 1,                   // Mathf.Max(1, badAction)
  gbBalance: 0,
  level: 1,                       // 等级最小为1
  subStat: 0
}
