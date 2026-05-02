# Magical Princess 存档编辑器

一个用于编辑《Magical Princess》游戏存档的Web工具，基于 Vue 3 + Vite 构建。

## 项目架构

```
save-editor/
├── src/
│   ├── components/              # UI组件 (高内聚)
│   │   ├── BasicEditor.vue      # 基础属性编辑
│   │   ├── DetailedEditor.vue   # 详细属性编辑
│   │   ├── EquipmentEditor.vue  # 装备编辑
│   │   ├── FriendEditor.vue     # NPC好感度编辑
│   │   ├── ItemEditor.vue       # 物品列表编辑
│   │   ├── SkillEditor.vue      # 技能列表编辑
│   │   ├── GlobalEditor.vue     # 跨轮回数据编辑
│   │   ├── QuickActions.vue     # 快捷操作面板
│   │   ├── FileHandler.vue      # 文件导入导出
│   │   └── Sidebar.vue          # 导航侧边栏
│   ├── composables/             # 业务逻辑 (低耦合)
│   │   ├── useCrypto.js         # AES加解密
│   │   ├── useSaveData.js       # 存档数据管理
│   │   └── useQuickActions.js   # 快捷操作逻辑
│   ├── data/                    # 静态数据
│   │   ├── constants.js         # 常量定义
│   │   ├── enums.js             # 枚举映射
│   │   ├── gameData.js          # 游戏数据 (物品/NPC/技能名称)
│   │   ├── keyMap.js            # JSON键名映射
│   │   └── mappings.js          # 字段中文标签
│   ├── utils/                   # 工具函数
│   │   ├── saveParser.js        # 存档解析/序列化
│   │   └── validators.js        # 数据验证
│   ├── App.vue                  # 主容器 (~150行)
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
- 月份、压力、金钱、黑币
- 行动力、善恶值、学院职业
- 声望、技能点、父爱好感度

### 详细属性编辑
- 四维等级 (体力/智力/魅力/感性)
- 16项子属性
- 战斗属性

### 装备编辑
- 服装、武器、防具
- 显示物品中文名称

### NPC编辑
- 37个NPC好感度
- 见面/对话/约会/送礼次数
- 恋爱事件

### 物品编辑
- 物品列表管理
- 142种物品中文名称
- 添加/删除物品

### 技能编辑
- 技能列表管理
- 100+技能中文名称
- 解锁/学习状态

### 跨轮回数据
- 玩家/父亲名称
- 生日设置
- 轮回次数、成就点数
- 恋爱状态、结局标记

### 快捷操作
- 一键满属性 (子属性2000，等级10)
- 金钱/黑币最大化
- 压力清零、行动力全满
- 全NPC满好感
- 解锁全部技能
- 时间跳转

## 数值上限 (与游戏代码一致)

| 属性 | 上限 | 依据 |
|------|------|------|
| 压力 | 0-100 | `Clamp(stress, 0, 100)` |
| 金钱 | 0-9,999,999 | 无硬性上限 |
| 黑币 | 0-9,999 | 无硬性上限 |
| 等级 | 1-18 | `maxLevel = 18` |
| 子属性 | 0-999 | 无硬性上限 |
| 好感度 | 0-100 | `fFavarite >= 100` |
| 恋爱事件 | 0-4 | `fLoveEvents >= 4` |
| 善恶平衡 | 0-100 | `Clamp(gbBalance, 0, 100)` |

## 存档文件位置

```
%USERPROFILE%/AppData/LocalLow/Neotro Inc_/MagicalPrincess/
```

文件格式：
- `v10_userdata1.dat` ~ `v10_userdata31.dat` (用户存档)
- `v10_indexdata.dat` (存档索引)

## 技术栈

| 技术 | 版本 | 用途 |
|------|------|------|
| Vue | 3.4+ | 前端框架 |
| Vite | 5.0+ | 构建工具 |
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

完整映射见 `src/data/keyMap.js`

## 注意事项

- 修改存档前请务必备份原文件
- 不合理的数值可能导致游戏异常
- 建议在游戏关闭时修改存档
- 部分属性之间存在关联关系

## 许可

仅供学习研究使用，请勿用于商业用途。
