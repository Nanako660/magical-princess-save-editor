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

// 属性上限
export const MAX_VALUES = {
  stress: 100,
  money: 9999999,
  blackCoin: 9999,
  activePower: 99,
  level: 10,
  subStat: 999,
  favorability: 100
}
