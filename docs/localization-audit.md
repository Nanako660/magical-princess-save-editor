# 本地化一致性审计报告

基线术语源：[`data/LanguageDump_zhCN_non_story.csv`](D:/1Temp/Code/Magical%20Princess/save-editor/data/LanguageDump_zhCN_non_story.csv)

## 结论

- `src/data/localization.js` 不是 CSV 的完整镜像。它只覆盖了 CSV 的前一部分条目，并且至少包含一处未转义引号异常，因此不能作为完整本地化基线使用。
- 默认名称层基本一致：`爱丽丝 / 马克 / 爸爸` 与 `NAME_DEFAULT / NAME_FATHER / NAME_PAPA` 对齐。
- 主要问题集中在两类：
  - 数据映射和 UI 硬编码没有统一使用游戏官方术语。
  - 同一功能或同一概念在不同页面出现了多套叫法。

## 数据层差异

| 优先级 | 位置 | 当前文案 | CSV键 | 官方文案 | 建议修复 | 可批量 |
| --- | --- | --- | --- | --- | --- | --- |
| P0 | `src/data/localization.js` | 仅包含 CSV 的部分条目，且存在异常项 | `STAT_SKL_GETARTS` | `获得"%s1"` | 重新从 CSV 全量导出并修复未转义引号 | 是 |
| P1 | `src/data/mappings.js > BasicStatusLabels.money` | 金钱 | `STAT_MONEY` | 财产 | 财产 | 是 |
| P1 | `src/data/mappings.js > BasicStatusLabels.reputation` | 名声/声望混用 | `STAT_REPUTATION` | 名声 | 名声 | 是 |
| P0 | `src/data/mappings.js > BasicStatusLabels.fatherFavarite` | 父女感情外部仍被改写成“父亲好感度” | `STAT_FFAV` | 父女感情 | 父女感情 | 是 |
| P0 | `src/data/mappings.js > BasicStatusLabels.phyKonjyo` | 精神 | `STAT_PHY3` | 意志 | 意志 | 是 |
| P0 | `src/data/mappings.js > BasicStatusLabels.intMajyutsu` | 魔术（数据层正确，但 UI 未统一） | `STAT_INT3` | 魔术 | 以数据层为准统一 UI | 是 |
| P0 | `src/data/mappings.js > BasicStatusLabels.senSouzou` | 想象（数据层正确，但 UI 未统一） | `STAT_SEN1` | 想象 | 以数据层为准统一 UI | 是 |
| P0 | `src/data/mappings.js > BasicStatusLabels.senSousaku` | 创意（数据层正确，但 UI 未统一） | `STAT_SEN2` | 创意 | 以数据层为准统一 UI | 是 |
| P0 | `src/data/mappings.js > BasicStatusLabels.senOnkan` | 音乐（数据层正确，但 UI 未统一） | `STAT_SEN3` | 音乐 | 以数据层为准统一 UI | 是 |
| P0 | `src/data/mappings.js > BasicStatusLabels.senBikan` | 美术（数据层正确，但 UI 未统一） | `STAT_SEN4` | 美术 | 以数据层为准统一 UI | 是 |
| P1 | `src/data/mappings.js > BasicStatusLabels.skillPoint` | 技能点数 | `STAT_SKP` | 技能点数 | 统一 UI 到“技能点数” | 是 |
| P0 | `src/data/mappings.js > GlobalStatusLabels.acvPoint` | 功绩点数 | `STAT_ACVP` | 功绩点数 | 页面上统一到“功绩点数” | 是 |

## UI 层差异

| 优先级 | 位置 | 当前文案 | CSV键 | 官方文案 | 建议修复 | 可批量 |
| --- | --- | --- | --- | --- | --- | --- |
| P1 | `src/components/BasicEditor.vue > 时间与资源 > 金钱` | 金钱 | `STAT_MONEY` | 财产 | 财产 | 是 |
| P1 | `src/components/BasicEditor.vue > 倾向与成长 > 善行值` | 善行值 | `STAT_GOODACT` | 善行 | 善行 | 是 |
| P1 | `src/components/BasicEditor.vue > 倾向与成长 > 恶行值` | 恶行值 | `STAT_BADACT` | 恶行 | 恶行 | 是 |
| P1 | `src/components/BasicEditor.vue > 倾向与成长 > 声望` | 声望 | `STAT_REPUTATION` | 名声 | 名声 | 是 |
| P1 | `src/components/BasicEditor.vue > 倾向与成长 > 技能点` | 技能点 | `STAT_SKP` | 技能点数 | 技能点数 | 是 |
| P0 | `src/components/BasicEditor.vue > 身份与关系 > 父亲好感度` | 父亲好感度 | `STAT_FFAV` | 父女感情 | 父女感情 | 是 |
| P0 | `src/components/DetailedEditor.vue > 智力属性 > 魔法` | 魔法 | `STAT_INT3` | 魔术 | 魔术 | 是 |
| P0 | `src/components/DetailedEditor.vue > 感性属性 > 创造` | 创造 | `STAT_SEN1` | 想象 | 想象 | 是 |
| P0 | `src/components/DetailedEditor.vue > 感性属性 > 创作` | 创作 | `STAT_SEN2` | 创意 | 创意 | 是 |
| P0 | `src/components/DetailedEditor.vue > 感性属性 > 直感` | 直感 | `STAT_SEN3` | 音乐 | 音乐 | 是 |
| P0 | `src/components/DetailedEditor.vue > 感性属性 > 美感` | 美感 | `STAT_SEN4` | 美术 | 美术 | 是 |
| P0 | `src/components/GlobalEditor.vue / src/components/Sidebar.vue` | 跨轮回数据 / 轮回数据 | 无直接对应键 | 无直接对应键 | 统一为单一页面名，建议“轮回数据” | 是 |

## 默认值层

当前未发现需要修复的默认名称差异：

- `src/utils/saveParser.js > playerName = 爱丽丝`
- `src/utils/saveParser.js > fatherName = 马克`
- `src/utils/saveParser.js > fatherGivenName = 爸爸`

它们分别与 `NAME_DEFAULT`、`NAME_FATHER`、`NAME_PAPA` 一致。

## 修复计划

1. 先统一共享映射层
   - 以 `src/data/mappings.js` 为第一修复入口，确保共享标签先与 CSV 对齐。
   - 如有必要，再补一个“编辑器别名层”，但默认展示应先收口到官方术语。

2. 再统一组件硬编码文案
   - 优先修基础属性、详细属性、轮回数据这三页，因为它们命中最多高优先级差异。
   - 页面标题、字段标签、按钮和说明文案按“同一概念仅保留一种叫法”处理。

3. 最后处理 fallback 和工具语境文案
   - `未知技能(...)`、`未知活动(...)` 这类保底文本不一定有 CSV 键，保留但应单独记录。
   - 无直接官方键的工具页标题允许保留，但同一功能内部必须统一。

## 复跑方式

执行：

```bash
npm run audit:localization
```

脚本位置：[`scripts/audit-localization.js`](D:/1Temp/Code/Magical%20Princess/save-editor/scripts/audit-localization.js)
