# Magical Princess 存档编辑器

一个用于编辑《Magical Princess》游戏存档的Web工具，基于 Vue 3 + Vite 构建。

🔗 **在线使用**: [GitHub Pages](https://nanako660.github.io/magical-princess-save-editor/) | 📥 **离线版本**: [Releases](https://github.com/Nanako660/magical-princess-save-editor/releases)

## 项目架构

```
save-editor/
├── src/
│   ├── components/              # UI组件
│   │   ├── BasicEditor.vue      # 基础属性编辑
│   │   ├── DetailedEditor.vue   # 详细属性编辑
│   │   ├── EquipmentEditor.vue  # 装备编辑
│   │   ├── FriendEditor.vue     # NPC好感度编辑
│   │   ├── BattleArtsEditor.vue # 战斗技能编辑
│   │   ├── ActivityEditor.vue   # 活动数据编辑
│   │   ├── CurriculumEditor.vue # 课程数据编辑
│   │   ├── ConfigEditor.vue     # 游戏设置编辑
│   │   ├── ItemEditor.vue       # 物品列表编辑
│   │   ├── SkillEditor.vue      # 技能列表编辑
│   │   ├── GlobalEditor.vue     # 跨轮回数据编辑
│   │   ├── QuickActions.vue     # 快捷操作面板
│   │   ├── SetupGuide.vue       # 首次使用引导
│   │   └── Sidebar.vue          # 导航侧边栏
│   ├── composables/             # 业务逻辑
│   │   ├── useCrypto.js         # AES加解密
│   │   ├── useDeferredTableRender.js # 列表延迟挂载
│   │   ├── useSaveData.js       # 存档数据管理
│   │   ├── useQuickActions.js   # 快捷操作逻辑
│   │   └── useViewportTableHeight.js # 列表高度计算
│   ├── data/                    # 静态数据
│   │   ├── constants.js         # 常量定义
│   │   ├── enums.js             # 枚举映射
│   │   ├── gameData.js          # 游戏数据 (物品/NPC/技能名称)
│   │   ├── keyMap.js            # JSON键名映射
│   │   ├── localization.js      # 本地化数据工具
│   │   ├── mappings.js          # 字段中文标签
│   │   └── periodData.js        # 月份周期数据
│   ├── utils/                   # 工具函数
│   │   ├── dirStore.js          # 目录句柄存储
│   │   ├── saveParser.js        # 存档解析/序列化
│   │   └── validators.js        # 数据验证
│   ├── App.vue                  # 主容器
│   └── main.js
├── dist/
│   └── index.html               # 打包后的单文件版本
├── package.json
├── vite.config.js
└── README.md
```

## 设计原则

### 高内聚
- 每个组件只负责一个功能模块
- 相关逻辑集中在同一文件
- 组件内部状态自管理

### 低耦合
- 通过 `v-model` 和事件通信
- 组件不直接依赖其他组件
- 业务逻辑封装在 Composable 中

### 单一职责
- Composable 处理业务逻辑
- 组件只负责UI渲染
- 工具函数纯函数化

## 使用方法

### 安装依赖
```bash
npm install
```

### 开发模式
```bash
npm run dev
```
访问 http://localhost:5173/

### 构建单文件版本
```bash
npm run build
```
构建结果在 `dist/index.html`，双击即可在浏览器中运行。

## 功能模块

### 基础属性编辑
- 月份、压力、金钱、东亚硬币
- 行动力、善恶值、学院职业
- 声望、技能点、父女感情

### 详细属性编辑
- 四维等级 (体力/智力/魅力/感性)
- 16项子属性
- 战斗属性（等级/经验）

### 装备编辑
- 服装、武器、饰品
- 显示物品中文名称

### NPC编辑
- 37个NPC好感度
- 见面/对话/约会/送礼次数
- 恋爱事件

### 物品编辑
- 物品列表管理
- 142种物品中文名称
- 分组表格直接编辑数量、使用次数与合成状态

### 技能编辑
- 技能列表管理
- 100+技能中文名称
- 解锁/学习状态

### 战斗技能 / 活动 / 课程编辑
- 战斗技能学习状态编辑
- 活动次数、完成次数与等级编辑
- 课程启用、完成和耐久编辑

### 游戏设置
- 语言、背景乐音量、音效音量、语音音量
- 文本显示速度与直播模式
- 目录初始化后自动预加载，统一通过“应用编辑”保存

### 跨轮回数据
- 玩家/父亲名称
- 生日设置
- 轮回次数、功绩点数
- 恋爱状态、结局标记

### 快捷操作
- 一键满属性 (子属性2000，等级10，战斗经验8000)
- 金钱/东亚硬币最大化
- 压力清零、行动力全满
- 全NPC满好感
- 解锁全部技能
- 时间跳转（跳到毕业/重置到初始月）
- 未选择存档时首页仍可查看，但快捷操作会保持禁用

## 数值上限

| 属性 | 上限 | 依据 |
|------|------|------|
| 压力 | 0-100 | `Clamp(stress, 0, 100)` |
| 金钱 | 0-9,999,999 | 无硬性上限 |
| 东亚硬币 | 0-9,999 | 无硬性上限 |
| 等级 | 1-18 | `maxLevel = 18` |
| 子属性 | 0-9,999 | 无硬性上限 |
| 好感度 | 0-100 | `fFavarite >= 100` |
| 恋爱事件 | 0-4 | `fLoveEvents >= 4` |
| 善恶平衡 | 0-100 | `Clamp(gbBalance, 0, 100)` |
| 战斗经验 | 0-99,999 | 无硬性上限 |

## 月份系统

游戏使用 `period` (0-42) 表示月份周期：

| period 范围 | 阶段 | 显示 |
|-------------|------|------|
| 0-5 | 童年期 | 童年 4月 ~ 童年 9月 |
| 6-17 | 学院1年级 | 1年级 9月 ~ 1年级 8月 |
| 18-29 | 学院2年级 | 2年级 9月 ~ 2年级 8月 |
| 30-41 | 学院3年级 | 3年级 9月 ~ 3年级 8月 |
| 42 | 毕业 | 毕业 |

完整数据见 `src/data/periodData.js`

## 本地化数据

所有文本与游戏官方中文翻译同步，数据来源：
- 游戏内解包导出
- 覆盖内容：物品名称、NPC名称、技能名称、属性标签、活动名称、课程名称等

## 存档文件位置

```
%USERPROFILE%/AppData/LocalLow/Neotro Inc_/MagicalPrincess/
```

文件格式：
- `v10_userdata1.dat` ~ `v10_userdata31.dat` (用户存档)
- `v10_configdata.dat` (游戏设置)

## 技术栈

| 技术 | 版本 | 用途 |
|------|------|------|
| Vue | 3.4+ | 前端框架 |
| Vite | 5.0+ | 构建工具 |
| Naive UI | 2.44+ | UI组件库 |
| CryptoJS | 4.2+ | AES加解密 |
| vite-plugin-singlefile | 2.0+ | 单文件打包 |

## 加密信息

游戏存档使用 AES 加密：
- **算法**: AES (RijndaelManaged)
- **模式**: CBC
- **填充**: ZeroPadding / Pkcs7
- **Key**: `giNArbHRlWBDIggF` (16字节)
- **IV**: `jC34fOybW3zEh0Kl` (16字节)

## 数据映射

JSON 使用简短键名，需要映射到完整字段名：

| JSON键 | 字段名 | 说明 |
|--------|--------|------|
| `m` | money | 金钱 |
| `st` | stress | 压力 |
| `p1` | phyKinryoku | 力量 |
| `f` | fFavarite | 好感度 |
| `bc` | blackCoin | 东亚硬币 |
| `ap` | activePower | 行动力 |
| `ga` | goodAction | 善行 |
| `ba` | badAction | 恶行 |

完整映射见 `src/data/keyMap.js`

## 注意事项

- 修改存档前请务必备份原文件
- 不合理的数值可能导致游戏异常
- 建议在游戏关闭时修改存档
- 部分属性之间存在关联关系
- 推荐使用 Chrome 或 Edge 浏览器

## 许可

仅供学习研究使用，请勿用于商业用途。
