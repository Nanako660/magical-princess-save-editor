// PeriodData - 游戏月份周期数据
// 从 Assembly-CSharp/MasterData.cs 提取
// 包含43条记录（period 0-42）

export const PeriodDataList = [
  // 童年期 (period 0-5)
  { periodId: 0, isChildhood: true, year: 0, month: 4 },
  { periodId: 1, isChildhood: true, year: 0, month: 5 },
  { periodId: 2, isChildhood: true, year: 0, month: 6 },
  { periodId: 3, isChildhood: true, year: 0, month: 7 },
  { periodId: 4, isChildhood: true, year: 0, month: 8 },
  { periodId: 5, isChildhood: true, year: 0, month: 9 },
  
  // 学院期 1年级 (period 6-17)
  { periodId: 6, isChildhood: false, year: 1, month: 9 },
  { periodId: 7, isChildhood: false, year: 1, month: 10 },
  { periodId: 8, isChildhood: false, year: 1, month: 11 },
  { periodId: 9, isChildhood: false, year: 1, month: 12 },
  { periodId: 10, isChildhood: false, year: 1, month: 1 },
  { periodId: 11, isChildhood: false, year: 1, month: 2 },
  { periodId: 12, isChildhood: false, year: 1, month: 3 },
  { periodId: 13, isChildhood: false, year: 1, month: 4 },
  { periodId: 14, isChildhood: false, year: 1, month: 5 },
  { periodId: 15, isChildhood: false, year: 1, month: 6 },
  { periodId: 16, isChildhood: false, year: 1, month: 7 },
  { periodId: 17, isChildhood: false, year: 1, month: 8 },
  
  // 学院期 2年级 (period 18-29)
  { periodId: 18, isChildhood: false, year: 2, month: 9 },
  { periodId: 19, isChildhood: false, year: 2, month: 10 },
  { periodId: 20, isChildhood: false, year: 2, month: 11 },
  { periodId: 21, isChildhood: false, year: 2, month: 12 },
  { periodId: 22, isChildhood: false, year: 2, month: 1 },
  { periodId: 23, isChildhood: false, year: 2, month: 2 },
  { periodId: 24, isChildhood: false, year: 2, month: 3 },
  { periodId: 25, isChildhood: false, year: 2, month: 4 },
  { periodId: 26, isChildhood: false, year: 2, month: 5 },
  { periodId: 27, isChildhood: false, year: 2, month: 6 },
  { periodId: 28, isChildhood: false, year: 2, month: 7 },
  { periodId: 29, isChildhood: false, year: 2, month: 8 },
  
  // 学院期 3年级 (period 30-41)
  { periodId: 30, isChildhood: false, year: 3, month: 9 },
  { periodId: 31, isChildhood: false, year: 3, month: 10 },
  { periodId: 32, isChildhood: false, year: 3, month: 11 },
  { periodId: 33, isChildhood: false, year: 3, month: 12 },
  { periodId: 34, isChildhood: false, year: 3, month: 1 },
  { periodId: 35, isChildhood: false, year: 3, month: 2 },
  { periodId: 36, isChildhood: false, year: 3, month: 3 },
  { periodId: 37, isChildhood: false, year: 3, month: 4 },
  { periodId: 38, isChildhood: false, year: 3, month: 5 },
  { periodId: 39, isChildhood: false, year: 3, month: 6 },
  { periodId: 40, isChildhood: false, year: 3, month: 7 },
  { periodId: 41, isChildhood: false, year: 3, month: 8 },
  
  // 毕业 (period 42)
  { periodId: 42, isChildhood: false, year: 3, month: 9 }
]

/**
 * 获取指定周期的 PeriodData
 * @param {number} period - 周期ID (0-42)
 * @returns {object|null}
 */
export function getPeriodData(period) {
  if (period < 0 || period >= PeriodDataList.length) return null
  return PeriodDataList[period]
}

/**
 * 获取月份显示文本（与游戏一致）
 * @param {number} period - 周期ID
 * @returns {string}
 */
export function getPeriodText(period) {
  if (period < 0) return '未开始'
  
  const data = PeriodDataList[period]
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

/**
 * 获取年级文本（不含月份）
 * @param {number} period - 周期ID
 * @returns {string}
 */
export function getYearText(period) {
  if (period < 0) return '未开始'
  
  const data = PeriodDataList[period]
  if (!data) return ''
  
  if (period === 42) return '毕业'
  return data.isChildhood ? '童年' : `${data.year}年级`
}

/**
 * 获取月份文本（不含年级）
 * @param {number} period - 周期ID
 * @returns {string}
 */
export function getMonthText(period) {
  if (period < 0) return ''
  
  const data = PeriodDataList[period]
  if (!data) return ''
  
  if (period === 42) return '毕业'
  return `${data.month}月`
}

/**
 * 判断是否童年期
 * @param {number} period - 周期ID
 * @returns {boolean}
 */
export function isChildhood(period) {
  const data = PeriodDataList[period]
  return data ? data.isChildhood : false
}

/**
 * 获取最大周期数
 * @returns {number}
 */
export function getMaxPeriod() {
  return PeriodDataList.length - 1
}
