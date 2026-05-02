import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

import { BasicStatusLabels, GlobalStatusLabels } from '../src/data/mappings.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const repoRoot = path.resolve(__dirname, '..')
const csvPath = path.join(repoRoot, 'data', 'LanguageDump_zhCN_non_story.csv')
const localizationPath = path.join(repoRoot, 'src', 'data', 'localization.js')

function parseCsv(text) {
  const lines = text.replace(/^\uFEFF/, '').split(/\r?\n/).filter(Boolean)
  const map = new Map()
  for (let i = 1; i < lines.length; i += 1) {
    const line = lines[i]
    const commaIndex = line.indexOf(',')
    if (commaIndex === -1) continue
    const key = line.slice(0, commaIndex).trim()
    const value = line.slice(commaIndex + 1).trim().replace(/^"|"$/g, '').replace(/""/g, '"')
    map.set(key, value)
  }
  return map
}

function load(file) {
  return fs.readFileSync(path.join(repoRoot, file), 'utf8')
}

const csv = parseCsv(fs.readFileSync(csvPath, 'utf8'))
const localizationSource = fs.readFileSync(localizationPath, 'utf8')
const files = {
  basic: load('src/components/BasicEditor.vue'),
  detailed: load('src/components/DetailedEditor.vue'),
  global: load('src/components/GlobalEditor.vue'),
  sidebar: load('src/components/Sidebar.vue'),
  quick: load('src/components/QuickActions.vue'),
  saveParser: load('src/utils/saveParser.js')
}

function hasLocalizationEntry(key, value) {
  const serialized = `"${key}": ${JSON.stringify(value)}`
  return localizationSource.includes(serialized)
}

const findings = []

function addFinding({
  layer,
  location,
  current,
  csvKey,
  priority,
  recommendation,
  batch = '否',
  note = ''
}) {
  findings.push({
    layer,
    location,
    current,
    csvKey,
    csvValue: csvKey ? (csv.get(csvKey) || '(CSV缺失)') : '无直接对应键',
    priority,
    recommendation,
    batch,
    note
  })
}

function exactCheck(name, actual, csvKey, location, priority = 'P0') {
  const expected = csv.get(csvKey)
  if (!expected) {
    addFinding({
      layer: '数据层',
      location,
      current: actual,
      csvKey,
      priority: 'P2',
      recommendation: actual,
      note: 'CSV 中不存在对应键，需人工确认源是否完整。'
    })
    return
  }
  if (actual !== expected) {
    addFinding({
      layer: '数据层',
      location,
      current: actual,
      csvKey,
      priority,
      recommendation: expected,
      batch: '是'
    })
  }
}

function containsCheck({ fileKey, needle, csvKey, location, priority = 'P1', recommendation, matcher }) {
  const hit = matcher ? matcher.test(files[fileKey]) : files[fileKey].includes(needle)
  if (!hit) return
  const expected = csv.get(csvKey)
  if (expected && needle !== expected) {
    addFinding({
      layer: 'UI层',
      location,
      current: needle,
      csvKey,
      priority,
      recommendation: recommendation || expected,
      batch: '是'
    })
  }
}

// 1) localization.js 与 CSV 的同步性
const localizationDiffs = []
for (const [key, value] of csv.entries()) {
  if (!hasLocalizationEntry(key, value)) {
    localizationDiffs.push({ key, csv: value })
  }
}

if (localizationDiffs.length > 0) {
  const sample = localizationDiffs[0]
  addFinding({
    layer: '数据层',
    location: 'src/data/localization.js',
    current: `仅包含 CSV 的部分条目，且存在异常项，示例: ${sample.key}`,
    csvKey: sample.key,
    priority: 'P0',
    recommendation: `重新从 CSV 全量导出并修复 ${sample.key} 等异常条目`,
    batch: '是',
    note: '当前文件不是 CSV 的完整镜像；已知 `STAT_SKL_GETARTS` 行包含未转义引号。'
  })
}

// 2) 数据层差异
exactCheck('money', BasicStatusLabels.money, 'STAT_MONEY', 'src/data/mappings.js > BasicStatusLabels.money', 'P1')
exactCheck('reputation', BasicStatusLabels.reputation, 'STAT_REPUTATION', 'src/data/mappings.js > BasicStatusLabels.reputation', 'P1')
exactCheck('fatherFavarite', BasicStatusLabels.fatherFavarite, 'STAT_FFAV', 'src/data/mappings.js > BasicStatusLabels.fatherFavarite', 'P0')
exactCheck('phyKonjyo', BasicStatusLabels.phyKonjyo, 'STAT_PHY3', 'src/data/mappings.js > BasicStatusLabels.phyKonjyo', 'P0')
exactCheck('intMajyutsu', BasicStatusLabels.intMajyutsu, 'STAT_INT3', 'src/data/mappings.js > BasicStatusLabels.intMajyutsu', 'P0')
exactCheck('senSouzou', BasicStatusLabels.senSouzou, 'STAT_SEN1', 'src/data/mappings.js > BasicStatusLabels.senSouzou', 'P0')
exactCheck('senSousaku', BasicStatusLabels.senSousaku, 'STAT_SEN2', 'src/data/mappings.js > BasicStatusLabels.senSousaku', 'P0')
exactCheck('senOnkan', BasicStatusLabels.senOnkan, 'STAT_SEN3', 'src/data/mappings.js > BasicStatusLabels.senOnkan', 'P0')
exactCheck('senBikan', BasicStatusLabels.senBikan, 'STAT_SEN4', 'src/data/mappings.js > BasicStatusLabels.senBikan', 'P0')
exactCheck('skillPoint', BasicStatusLabels.skillPoint, 'STAT_SKP', 'src/data/mappings.js > BasicStatusLabels.skillPoint', 'P1')
exactCheck('acvPoint', GlobalStatusLabels.acvPoint, 'STAT_ACVP', 'src/data/mappings.js > GlobalStatusLabels.acvPoint', 'P0')

// 3) UI 层差异
containsCheck({
  fileKey: 'basic',
  needle: '金钱',
  csvKey: 'STAT_MONEY',
  location: 'src/components/BasicEditor.vue > 时间与资源 > 金钱'
})
containsCheck({
  fileKey: 'basic',
  needle: '善行值',
  csvKey: 'STAT_GOODACT',
  location: 'src/components/BasicEditor.vue > 倾向与成长 > 善行值',
  recommendation: csv.get('STAT_GOODACT')
})
containsCheck({
  fileKey: 'basic',
  needle: '恶行值',
  csvKey: 'STAT_BADACT',
  location: 'src/components/BasicEditor.vue > 倾向与成长 > 恶行值',
  recommendation: csv.get('STAT_BADACT')
})
containsCheck({
  fileKey: 'basic',
  needle: '声望',
  csvKey: 'STAT_REPUTATION',
  location: 'src/components/BasicEditor.vue > 倾向与成长 > 声望'
})
containsCheck({
  fileKey: 'basic',
  needle: '技能点',
  csvKey: 'STAT_SKP',
  location: 'src/components/BasicEditor.vue > 倾向与成长 > 技能点',
  recommendation: csv.get('STAT_SKP'),
  matcher: /label="技能点"(?!数)/
})
containsCheck({
  fileKey: 'basic',
  needle: '父亲好感度',
  csvKey: 'STAT_FFAV',
  location: 'src/components/BasicEditor.vue > 身份与关系 > 父亲好感度',
  priority: 'P0'
})
containsCheck({
  fileKey: 'detailed',
  needle: '魔法',
  csvKey: 'STAT_INT3',
  location: 'src/components/DetailedEditor.vue > 智力属性 > 魔法',
  priority: 'P0',
  recommendation: csv.get('STAT_INT3')
})
containsCheck({
  fileKey: 'detailed',
  needle: '创造',
  csvKey: 'STAT_SEN1',
  location: 'src/components/DetailedEditor.vue > 感性属性 > 创造',
  priority: 'P0',
  recommendation: csv.get('STAT_SEN1')
})
containsCheck({
  fileKey: 'detailed',
  needle: '创作',
  csvKey: 'STAT_SEN2',
  location: 'src/components/DetailedEditor.vue > 感性属性 > 创作',
  priority: 'P0',
  recommendation: csv.get('STAT_SEN2')
})
containsCheck({
  fileKey: 'detailed',
  needle: '直感',
  csvKey: 'STAT_SEN3',
  location: 'src/components/DetailedEditor.vue > 感性属性 > 直感',
  priority: 'P0',
  recommendation: csv.get('STAT_SEN3')
})
containsCheck({
  fileKey: 'detailed',
  needle: '美感',
  csvKey: 'STAT_SEN4',
  location: 'src/components/DetailedEditor.vue > 感性属性 > 美感',
  priority: 'P0',
  recommendation: csv.get('STAT_SEN4')
})

if (files.global.includes('跨轮回数据') && files.sidebar.includes("label: '轮回数据'")) {
  addFinding({
    layer: 'UI层',
    location: 'src/components/GlobalEditor.vue / src/components/Sidebar.vue',
    current: '跨轮回数据 / 轮回数据',
    csvKey: '',
    csvValue: '无直接对应键',
    priority: 'P0',
    recommendation: '统一为单一页面名（建议“轮回数据”）',
    batch: '是',
    note: '同一功能入口和页面标题内部不一致。'
  })
}

// 4) 默认值层
for (const [snippet, csvKey, label] of [
  ["playerName: '爱丽丝'", 'NAME_DEFAULT', '默认女儿名'],
  ["fatherName: '马克'", 'NAME_FATHER', '默认父亲名'],
  ["fatherGivenName: '爸爸'", 'NAME_PAPA', '默认父亲昵称']
]) {
  if (!files.saveParser.includes(snippet)) continue
  const current = snippet.match(/'([^']+)'/)[1]
  const expected = csv.get(csvKey)
  if (current !== expected) {
    addFinding({
      layer: '默认值层',
      location: `src/utils/saveParser.js > ${label}`,
      current,
      csvKey,
      priority: 'P0',
      recommendation: expected,
      batch: '是'
    })
  }
}

// 5) 仅说明但不报错
const notes = []
if (localizationDiffs.length === 0) {
  notes.push('- `src/data/localization.js` 与 CSV 当前未发现键值差异，可视为可信导出副本。')
}
if (files.saveParser.includes("playerName: '爱丽丝'") && files.saveParser.includes("fatherName: '马克'") && files.saveParser.includes("fatherGivenName: '爸爸'")) {
  notes.push('- `src/utils/saveParser.js` 中默认名称与 `NAME_DEFAULT` / `NAME_FATHER` / `NAME_PAPA` 一致。')
}
if (files.quick.includes('轮回数据') && files.sidebar.includes("label: 'global', label: '轮回数据'")) {
  notes.push('- 首页说明与侧边栏对该模块都使用“轮回数据”，但页面标题仍为“跨轮回数据”。')
}

function groupByLayer(items) {
  return items.reduce((acc, item) => {
    acc[item.layer] ||= []
    acc[item.layer].push(item)
    return acc
  }, {})
}

const grouped = groupByLayer(findings)

function printMarkdown() {
  console.log('# 本地化一致性审计')
  console.log('')
  console.log(`- CSV 源文件: \`${path.relative(repoRoot, csvPath)}\``)
  console.log(`- localization.js 原始键值差异数: ${localizationDiffs.length}`)
  console.log(`- 审计发现数: ${findings.length}`)
  console.log('')
  for (const note of notes) console.log(note)
  console.log('')
  for (const [layer, items] of Object.entries(grouped)) {
    console.log(`## ${layer}`)
    console.log('')
    console.log('| 优先级 | 位置 | 当前文案 | CSV键 | 官方文案 | 建议修复 | 可批量 | 说明 |')
    console.log('| --- | --- | --- | --- | --- | --- | --- | --- |')
    for (const item of items) {
      console.log(`| ${item.priority} | ${item.location} | ${item.current} | ${item.csvKey || '-'} | ${item.csvValue} | ${item.recommendation} | ${item.batch} | ${item.note || '-'} |`)
    }
    console.log('')
  }
}

printMarkdown()
