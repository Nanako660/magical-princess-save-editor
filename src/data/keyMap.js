// Status字段键名映射 (JSON简短键 -> C#字段名)
export const StatusKeyMap = {
  // 基础资源
  pd: 'period',
  st: 'stress',
  m: 'money',
  mgt: 'moneyGetTotal',
  bc: 'blackCoin',
  bcd: 'blackCoinGettedFromDice',
  ap: 'activePower',
  am: 'activePowerMax',
  amc: 'activePowerMaxChildhood',
  
  // 善恶值
  ga: 'goodAction',
  ba: 'badAction',
  bl: 'gbBalance',
  
  // 父亲爱好感度
  ff: 'fatherFavarite',
  fv: 'fatherFavLevel',
  
  // 声望
  r: 'reputation',
  c: 'acClass',
  skp: 'skillPoint',
  
  // 装备
  ec: 'equipCloth',
  ew: 'equipWeapon',
  ea: 'equipArmor',
  
  // 四维等级
  lp: 'levelPhysical',
  li: 'levelIntelligence',
  lc: 'levelCharm',
  ls: 'levelSense',
  
  // 四维经验
  vp: 'valuePhysical',
  vi: 'valueIntelligence',
  vc: 'valueCharm',
  vs: 'valueSense',
  
  // 战斗等级
  lb: 'levelBattle',
  la: 'levelArts',
  lm: 'levelMagic',
  b0: 'btlExp',
  bpp: 'battlePosition',
  
  // 体力子属性
  p1: 'phyKinryoku',
  p2: 'phySeimei',
  p3: 'phyKonjyo',
  p4: 'phyBinsho',
  
  // 智力子属性
  i1: 'intBungaku',
  i2: 'intSanjyutsu',
  i3: 'intMajyutsu',
  i4: 'intShinkou',
  
  // 魅力子属性
  c1: 'chaBibou',
  c2: 'chaShakou',
  c3: 'chaReigi',
  c4: 'chaDoutoku',
  
  // 感性子属性
  s1: 'senSouzou',
  s2: 'senSousaku',
  s3: 'senOnkan',
  s4: 'senBikan',
  
  // 技能解锁
  iusp: 'isUnlockSkillPhysical',
  iusi: 'isUnlockSkillIntelligence',
  iusc: 'isUnlockSkillCharm',
  iuss: 'isUnlockSkillSense',
  
  // 被动参数
  ksl: 'salaryRate',
  kr1: 'phyRate',
  kr2: 'intRate',
  kr3: 'chaRate',
  kr4: 'senRate',
  bpr: 'buyPriceRate',
  spr: 'salePriceRate',
  kap: 'aliceProtect',
  kds: 'daySteal',
  kbr: 'battleRecovery',
  ksb: 'successBoost',
  kas: 'actStatusRate',
  ktf: 'talkFavRate',
  kdf: 'dateFavRate',
  kpf: 'presentFavRate',
  ktfp: 'talkFavPlus',
  kdfp: 'dateFavPlus',
  kpfp: 'presentFavPlus',
  kafp: 'activityFavPlus',
  kdg: 'dateGold',
  ksm: 'stressMonthRecover',
  kss: 'stressSleepRecoverPlus',
  ksf: 'stressFatherRate',
  kfs: 'fesScoreBonus',
  kcs: 'curriculumSessions',
  kst: 'stealRate',
  sfc: 'stressFullCutRate',
  kfb: 'foodDoubleRate',
  kbi: 'battleItemRate',
  kbm: 'battleMoneyRate',
  sbc: 'sfBlackCoinRate',
  gdr: 'gabageDoubleRate',
  nap: 'nightActivePowerUp',
  prd: 'productDoubleRate',
  ghp: 'gutsHP',
  rst: 'renameStart',
  
  // 布尔标记
  ilr: 'isLoseRedMoonLastMonth',
  tism: 'isStartMonth',
  tihl: 'isHomeLeave',
  tiss: 'isStressSafe',
  tifb: 'isFinishRedMoonBattle',
  tifc: 'isFinishRedMoonCentral',
  tihu: 'isHistoryUpdate',
  lab: 'isLastAllianceBattleAction',
  ltb: 'isTryLastBoss',
  ldb: 'isDestroyLastBoss',
  ioc: 'isOpenResearchCurse',
  iol: 'isOpenLabyrinth',
  icl: 'isChallengeLabyrinth',
  ido: 'isDestroyOrphelia',
  
  // 计数器
  cs: 'countSteal',
  ss: 'countStealSuccess',
  chv: 'countHospitalVisit',
  ced: 'countEnemyDestroy',
  cft: 'countFamilyTrip',
  cbc: 'countBlackCoin',
  cbw: 'countBoughtWear',
  crb: 'countRedMoonBattleJoined',
  cwm: 'countWinMagicContest',
  cws: 'countWinSwordContest',
  cwg: 'countWinGambleContest',
  cwd: 'countWinDanceContest',
  cwa: 'countWinArtContest',
  chm: 'countAliceHealMagic',
  
  // 其他
  bpl: 'battlePartyLastMonth',
  fcc: 'canCraft',
  fcv: 'canVacation',
  fsf: 'stressFatherAdd',
  fsv: 'stressVacationRate',
  fca: 'craftAddRateF',
  tdcc: 'diceCharaCurrent',
  tdbm: 'diceBetMin',
  tdbu: 'diceBetUnit',
  tdbx: 'diceBetMax',
  tdel: 'diceEnemyLevel',
  tdbr: 'diceBaseRequire',
  lcl: 'locationCheckLastLoveEvent'
}

// GlobalStatus字段键名映射
export const GlobalStatusKeyMap = {
  id: 'userId',
  c: 'loopCount',
  s: 'saveSlotId',
  pn: 'playerName',
  fn: 'fatherName',
  fg: 'fatherGivenName',
  pb: 'playerBirthDay',
  pbd: 'playerBirthDayDate',
  fb: 'fatherBirthDay',
  fbd: 'fatherBirthDayDate',
  te: 'isShowTrueEnding',
  ae: 'isShowAnotherEnding',
  inl: 'isNextLoopStart',
  cmf: 'cornetMaxFav',
  cml: 'cornetMaxLoveEvent',
  iccr: 'isCoupledCrowa',
  icch: 'isCoupledChocola',
  icfr: 'isCoupledFran',
  icco: 'isCoupledCornet',
  icsl: 'isCoupledShaile',
  ichs: 'isCoupledHasis',
  icna: 'isCoupledNoah',
  ap: 'acvPoint',
  aul: 'acvUnlockedIds',
  agi: 'acvGettedItemIds',
  aci: 'acvCraftedItemIds',
  afe: 'acvFriendshipEventIds',
  aft: 'acvFamilyTripEventIds',
  ace: 'acvCrimeEventIds'
}

// FriendDataParam字段键名映射
export const FriendKeyMap = {
  id: 'friendId',
  m: 'fMeet',
  f: 'fFavarite',
  c: 'fConversation',
  d: 'fDate',
  p: 'fPresent',
  mm: 'fMeetMonth',
  cm: 'fConversationMonth',
  dm: 'fDateMonth',
  pm: 'fPresentMonth',
  l: 'fLoveEvents',
  h: 'fBeHospitalized',
  hb: 'hasBeenHospitalized',
  fl: 'fLeaved',
  lb: 'levelBattle',
  ex: 'btlExp',
  bp: 'battlePosition'
}

// ItemDataParam字段键名映射
export const ItemKeyMap = {
  id: 'itemId',
  c: 'count',
  u: 'useCount',
  g: 'getCount',
  k: 'isCraft',
  s: 'monthStock',
  tc: 'countTemp',
  sg: 'isShowGetEffect'
}

// SkillDataParam字段键名映射
export const SkillKeyMap = {
  id: 'skillId',
  io: 'isOpened',
  il: 'isLearned'
}

// 反向映射（用于导出）
export const StatusKeyMapReverse = Object.fromEntries(
  Object.entries(StatusKeyMap).map(([k, v]) => [v, k])
)

export const GlobalStatusKeyMapReverse = Object.fromEntries(
  Object.entries(GlobalStatusKeyMap).map(([k, v]) => [v, k])
)

export const FriendKeyMapReverse = Object.fromEntries(
  Object.entries(FriendKeyMap).map(([k, v]) => [v, k])
)

export const ItemKeyMapReverse = Object.fromEntries(
  Object.entries(ItemKeyMap).map(([k, v]) => [v, k])
)

export const SkillKeyMapReverse = Object.fromEntries(
  Object.entries(SkillKeyMap).map(([k, v]) => [v, k])
)

// BattleArtsDataParam字段键名映射
export const BattleArtsKeyMap = {
  id: 'battleArtsId',
  l: 'isLearned'
}

// ActivityDataParam字段键名映射
export const ActivityKeyMap = {
  id: 'activityID',
  c: 'eventCount',
  cm: 'eventCountMonth',
  tm: 'tryCountMonth',
  cc: 'completeCount',
  fc: 'freeCount',
  b: 'badCount',
  d: 'damageCount',
  t: 'theftCount',
  l: 'level',
  s: 'isSale',
  n: 'isBonus'
}

// CurriculumDataParam字段键名映射
export const CurriculumKeyMap = {
  id: 'curriculumId',
  a: 'isActive',
  c: 'isComplete',
  h: 'restHP'
}

// SaveDataUserConfig字段键名映射
export const ConfigKeyMap = {
  lt: 'lang',
  vb: 'volumeBGM',
  ve: 'volumeSE',
  vv: 'volumeVoice',
  ms: 'messageSpeed',
  cm: 'isCastingMode',
  fg: 'flagEventReadedGlobal',
  fi: 'flagItemGettedGlobal'
}

// 反向映射
export const BattleArtsKeyMapReverse = Object.fromEntries(
  Object.entries(BattleArtsKeyMap).map(([k, v]) => [v, k])
)

export const ActivityKeyMapReverse = Object.fromEntries(
  Object.entries(ActivityKeyMap).map(([k, v]) => [v, k])
)

export const CurriculumKeyMapReverse = Object.fromEntries(
  Object.entries(CurriculumKeyMap).map(([k, v]) => [v, k])
)

export const ConfigKeyMapReverse = Object.fromEntries(
  Object.entries(ConfigKeyMap).map(([k, v]) => [v, k])
)
