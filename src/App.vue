<template>
  <div class="app">
    <header class="header">
      <h1>Magical Princess 存档编辑器</h1>
      <div class="header-actions">
        <button @click="importSave" class="btn btn-primary">导入存档</button>
        <button @click="exportSave" class="btn btn-success" :disabled="!saveData">导出存档</button>
        <input type="file" ref="fileInput" @change="handleFileImport" accept=".dat" style="display: none">
      </div>
    </header>

    <div class="main-content" v-if="saveData">
      <nav class="sidebar">
        <ul class="nav-list">
          <li 
            v-for="item in menuItems" 
            :key="item.id"
            :class="{ active: activeTab === item.id }"
            @click="activeTab = item.id"
          >
            {{ item.label }}
          </li>
        </ul>
      </nav>

      <main class="content">
        <!-- 基础属性 -->
        <section v-if="activeTab === 'basic'" class="editor-section">
          <h2>基础属性</h2>
          <div class="form-grid">
            <div class="form-group">
              <label>当前月份</label>
              <div class="input-with-text">
                <input type="number" v-model.number="saveData.status.period" min="0" max="42">
                <span class="hint">{{ getPeriodText(saveData.status.period) }}</span>
              </div>
            </div>
            <div class="form-group">
              <label>压力</label>
              <input type="number" v-model.number="saveData.status.stress" min="0" max="100">
            </div>
            <div class="form-group">
              <label>金钱</label>
              <input type="number" v-model.number="saveData.status.money" min="0" max="9999999">
            </div>
            <div class="form-group">
              <label>黑币</label>
              <input type="number" v-model.number="saveData.status.blackCoin" min="0" max="9999">
            </div>
            <div class="form-group">
              <label>行动力</label>
              <input type="number" v-model.number="saveData.status.activePower" min="0" max="99">
            </div>
            <div class="form-group">
              <label>最大行动力</label>
              <input type="number" v-model.number="saveData.status.activePowerMax" min="0" max="99">
            </div>
            <div class="form-group">
              <label>善行值</label>
              <input type="number" v-model.number="saveData.status.goodAction" min="1">
            </div>
            <div class="form-group">
              <label>恶行值</label>
              <input type="number" v-model.number="saveData.status.badAction" min="1">
            </div>
            <div class="form-group">
              <label>善恶平衡</label>
              <input type="number" v-model.number="saveData.status.gbBalance" min="0" max="100">
            </div>
            <div class="form-group">
              <label>学院职业</label>
              <select v-model.number="saveData.status.acClass">
                <option v-for="(name, val) in AcademyClass" :key="val" :value="parseInt(val)">{{ name }}</option>
              </select>
            </div>
            <div class="form-group">
              <label>声望</label>
              <input type="number" v-model.number="saveData.status.reputation" min="0" max="9999">
            </div>
            <div class="form-group">
              <label>技能点</label>
              <input type="number" v-model.number="saveData.status.skillPoint" min="0" max="9999">
            </div>
          </div>
        </section>

        <!-- 详细属性 -->
        <section v-if="activeTab === 'detailed'" class="editor-section">
          <h2>详细属性</h2>
          
          <!-- 四维等级 -->
          <div class="subsection">
            <h3>四维等级 (1-18)</h3>
            <div class="form-grid">
              <div class="form-group">
                <label>体力等级</label>
                <input type="number" v-model.number="saveData.status.levelPhysical" min="1" max="18">
              </div>
              <div class="form-group">
                <label>智力等级</label>
                <input type="number" v-model.number="saveData.status.levelIntelligence" min="1" max="18">
              </div>
              <div class="form-group">
                <label>魅力等级</label>
                <input type="number" v-model.number="saveData.status.levelCharm" min="1" max="18">
              </div>
              <div class="form-group">
                <label>感性等级</label>
                <input type="number" v-model.number="saveData.status.levelSense" min="1" max="18">
              </div>
            </div>
          </div>

          <!-- 体力属性 -->
          <div class="subsection">
            <h3>体力属性</h3>
            <div class="form-grid">
              <div class="form-group">
                <label>体力经验</label>
                <input type="number" v-model.number="saveData.status.valuePhysical" min="0">
              </div>
              <div class="form-group">
                <label>力量</label>
                <input type="number" v-model.number="saveData.status.phyKinryoku" min="0" max="999">
              </div>
              <div class="form-group">
                <label>生命</label>
                <input type="number" v-model.number="saveData.status.phySeimei" min="0" max="999">
              </div>
              <div class="form-group">
                <label>精神</label>
                <input type="number" v-model.number="saveData.status.phyKonjyo" min="0" max="999">
              </div>
              <div class="form-group">
                <label>敏捷</label>
                <input type="number" v-model.number="saveData.status.phyBinsho" min="0" max="999">
              </div>
            </div>
          </div>

          <!-- 智力属性 -->
          <div class="subsection">
            <h3>智力属性</h3>
            <div class="form-grid">
              <div class="form-group">
                <label>智力经验</label>
                <input type="number" v-model.number="saveData.status.valueIntelligence" min="0">
              </div>
              <div class="form-group">
                <label>文学</label>
                <input type="number" v-model.number="saveData.status.intBungaku" min="0" max="999">
              </div>
              <div class="form-group">
                <label>算术</label>
                <input type="number" v-model.number="saveData.status.intSanjyutsu" min="0" max="999">
              </div>
              <div class="form-group">
                <label>魔法</label>
                <input type="number" v-model.number="saveData.status.intMajyutsu" min="0" max="999">
              </div>
              <div class="form-group">
                <label>信仰</label>
                <input type="number" v-model.number="saveData.status.intShinkou" min="0" max="999">
              </div>
            </div>
          </div>

          <!-- 魅力属性 -->
          <div class="subsection">
            <h3>魅力属性</h3>
            <div class="form-grid">
              <div class="form-group">
                <label>魅力经验</label>
                <input type="number" v-model.number="saveData.status.valueCharm" min="0">
              </div>
              <div class="form-group">
                <label>美貌</label>
                <input type="number" v-model.number="saveData.status.chaBibou" min="0" max="999">
              </div>
              <div class="form-group">
                <label>社交</label>
                <input type="number" v-model.number="saveData.status.chaShakou" min="0" max="999">
              </div>
              <div class="form-group">
                <label>礼仪</label>
                <input type="number" v-model.number="saveData.status.chaReigi" min="0" max="999">
              </div>
              <div class="form-group">
                <label>道德</label>
                <input type="number" v-model.number="saveData.status.chaDoutoku" min="0" max="999">
              </div>
            </div>
          </div>

          <!-- 感性属性 -->
          <div class="subsection">
            <h3>感性属性</h3>
            <div class="form-grid">
              <div class="form-group">
                <label>感性经验</label>
                <input type="number" v-model.number="saveData.status.valueSense" min="0">
              </div>
              <div class="form-group">
                <label>创造</label>
                <input type="number" v-model.number="saveData.status.senSouzou" min="0" max="999">
              </div>
              <div class="form-group">
                <label>创作</label>
                <input type="number" v-model.number="saveData.status.senSousaku" min="0" max="999">
              </div>
              <div class="form-group">
                <label>直感</label>
                <input type="number" v-model.number="saveData.status.senOnkan" min="0" max="999">
              </div>
              <div class="form-group">
                <label>美感</label>
                <input type="number" v-model.number="saveData.status.senBikan" min="0" max="999">
              </div>
            </div>
          </div>

          <!-- 战斗属性 -->
          <div class="subsection">
            <h3>战斗属性</h3>
            <div class="form-grid">
              <div class="form-group">
                <label>战斗等级</label>
                <input type="number" v-model.number="saveData.status.levelBattle" min="1" max="18">
              </div>
              <div class="form-group">
                <label>技能等级</label>
                <input type="number" v-model.number="saveData.status.levelArts" min="1" max="18">
              </div>
              <div class="form-group">
                <label>魔法等级</label>
                <input type="number" v-model.number="saveData.status.levelMagic" min="1" max="18">
              </div>
              <div class="form-group">
                <label>战斗经验</label>
                <input type="number" v-model.number="saveData.status.btlExp" min="0" max="99999">
              </div>
            </div>
          </div>
        </section>

        <!-- 装备编辑 -->
        <section v-if="activeTab === 'equipment'" class="editor-section">
          <h2>装备</h2>
          <div class="form-grid">
            <div class="form-group">
              <label>服装</label>
              <div class="equip-item">
                <span class="equip-name">{{ getItemName(saveData.status.equipCloth) }}</span>
                <input type="number" v-model.number="saveData.status.equipCloth" min="-1" class="id-input">
              </div>
              <span class="hint">-1 = 未装备</span>
            </div>
            <div class="form-group">
              <label>武器</label>
              <div class="equip-item">
                <span class="equip-name">{{ getItemName(saveData.status.equipWeapon) }}</span>
                <input type="number" v-model.number="saveData.status.equipWeapon" min="-1" class="id-input">
              </div>
              <span class="hint">-1 = 未装备</span>
            </div>
            <div class="form-group">
              <label>防具</label>
              <div class="equip-item">
                <span class="equip-name">{{ getItemName(saveData.status.equipArmor) }}</span>
                <input type="number" v-model.number="saveData.status.equipArmor" min="-1" class="id-input">
              </div>
              <span class="hint">-1 = 未装备</span>
            </div>
          </div>
        </section>

        <!-- NPC编辑 -->
        <section v-if="activeTab === 'npc'" class="editor-section">
          <h2>NPC好感度</h2>
          <div class="npc-list">
            <div v-for="(npc, index) in saveData.friendDataParamList" :key="index" class="npc-card">
              <div class="npc-header">
                <span class="npc-name">{{ getCharaName(npc.friendId || index) }}</span>
                <span class="npc-id">好感度: {{ npc.fFavarite }}</span>
              </div>
              <div class="npc-fields">
                <div class="form-group">
                  <label>好感度</label>
                  <input type="number" v-model.number="npc.fFavarite" min="0" max="100">
                </div>
                <div class="form-group">
                  <label>见面次数</label>
                  <input type="number" v-model.number="npc.fMeet" min="0">
                </div>
                <div class="form-group">
                  <label>对话次数</label>
                  <input type="number" v-model.number="npc.fConversation" min="0">
                </div>
                <div class="form-group">
                  <label>约会次数</label>
                  <input type="number" v-model.number="npc.fDate" min="0">
                </div>
                <div class="form-group">
                  <label>送礼次数</label>
                  <input type="number" v-model.number="npc.fPresent" min="0">
                </div>
                <div class="form-group">
                  <label>恋爱事件</label>
                  <input type="number" v-model.number="npc.fLoveEvents" min="0" max="4">
                </div>
              </div>
            </div>
          </div>
        </section>

        <!-- 物品编辑 -->
        <section v-if="activeTab === 'items'" class="editor-section">
          <h2>物品列表</h2>
          <div class="list-controls">
            <button @click="addItem" class="btn btn-small">添加物品</button>
          </div>
          <table class="data-table">
            <thead>
              <tr>
                <th>物品名称</th>
                <th>数量</th>
                <th>使用次数</th>
                <th>已合成</th>
                <th>操作</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item, index) in saveData.itemDataParamList" :key="index">
                <td>
                  <div class="item-name-cell">
                    <span class="item-name">{{ getItemName(item.itemId) }}</span>
                    <input type="number" v-model.number="item.itemId" min="0" class="id-input" title="物品ID">
                  </div>
                </td>
                <td><input type="number" v-model.number="item.count" min="0"></td>
                <td><input type="number" v-model.number="item.useCount" min="0"></td>
                <td><input type="checkbox" v-model="item.isCraft"></td>
                <td><button @click="removeItem(index)" class="btn btn-danger btn-small">删除</button></td>
              </tr>
            </tbody>
          </table>
        </section>

        <!-- 技能编辑 -->
        <section v-if="activeTab === 'skills'" class="editor-section">
          <h2>技能列表</h2>
          <div class="list-controls">
            <button @click="addSkill" class="btn btn-small">添加技能</button>
          </div>
          <table class="data-table">
            <thead>
              <tr>
                <th>技能名称</th>
                <th>已解锁</th>
                <th>已学习</th>
                <th>操作</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(skill, index) in saveData.skillDataParamList" :key="index">
                <td>
                  <div class="item-name-cell">
                    <span class="item-name">{{ getSkillName(skill.skillId) }}</span>
                    <input type="number" v-model.number="skill.skillId" min="0" class="id-input" title="技能ID">
                  </div>
                </td>
                <td><input type="checkbox" v-model="skill.isOpened"></td>
                <td><input type="checkbox" v-model="skill.isLearned"></td>
                <td><button @click="removeSkill(index)" class="btn btn-danger btn-small">删除</button></td>
              </tr>
            </tbody>
          </table>
        </section>

        <!-- 跨轮回数据 -->
        <section v-if="activeTab === 'global'" class="editor-section">
          <h2>跨轮回数据</h2>
          <div class="form-grid">
            <div class="form-group">
              <label>轮回次数</label>
              <input type="number" v-model.number="saveData.gstatus.loopCount" min="1">
            </div>
            <div class="form-group">
              <label>玩家名称</label>
              <input type="text" v-model="saveData.gstatus.playerName">
            </div>
            <div class="form-group">
              <label>父亲名称</label>
              <input type="text" v-model="saveData.gstatus.fatherName">
            </div>
            <div class="form-group">
              <label>父亲昵称</label>
              <input type="text" v-model="saveData.gstatus.fatherGivenName">
            </div>
            <div class="form-group">
              <label>玩家生日月</label>
              <input type="number" v-model.number="saveData.gstatus.playerBirthDay" min="1" max="12">
            </div>
            <div class="form-group">
              <label>玩家生日日</label>
              <input type="number" v-model.number="saveData.gstatus.playerBirthDayDate" min="1" max="31">
            </div>
            <div class="form-group">
              <label>父亲生日月</label>
              <input type="number" v-model.number="saveData.gstatus.fatherBirthDay" min="1" max="12">
            </div>
            <div class="form-group">
              <label>父亲生日日</label>
              <input type="number" v-model.number="saveData.gstatus.fatherBirthDayDate" min="1" max="31">
            </div>
            <div class="form-group">
              <label>成就点数</label>
              <input type="number" v-model.number="saveData.gstatus.acvPoint" min="0">
            </div>
          </div>

          <div class="subsection">
            <h3>结局标记</h3>
            <div class="checkbox-group">
              <label><input type="checkbox" v-model="saveData.gstatus.isShowTrueEnding"> 已显示真结局</label>
              <label><input type="checkbox" v-model="saveData.gstatus.isShowAnotherEnding"> 已显示隐藏结局</label>
              <label><input type="checkbox" v-model="saveData.gstatus.isNextLoopStart"> 下周目开始</label>
            </div>
          </div>

          <div class="subsection">
            <h3>恋爱状态</h3>
            <div class="checkbox-group">
              <label><input type="checkbox" v-model="saveData.gstatus.isCoupledCrowa"> 克洛瓦</label>
              <label><input type="checkbox" v-model="saveData.gstatus.isCoupledChocola"> 巧克拉</label>
              <label><input type="checkbox" v-model="saveData.gstatus.isCoupledFran"> 弗兰</label>
              <label><input type="checkbox" v-model="saveData.gstatus.isCoupledCornet"> 科内特</label>
              <label><input type="checkbox" v-model="saveData.gstatus.isCoupledShaile"> 夏尔</label>
              <label><input type="checkbox" v-model="saveData.gstatus.isCoupledHasis"> 哈希斯</label>
              <label><input type="checkbox" v-model="saveData.gstatus.isCoupledNoah"> 诺亚</label>
            </div>
          </div>
        </section>

        <!-- 快捷操作 -->
        <section v-if="activeTab === 'quick'" class="editor-section">
          <h2>快捷操作</h2>
          <p class="warning">警告：以下操作会直接修改存档数据，请谨慎使用！</p>
          
          <div class="quick-actions">
            <div class="action-group">
              <h3>属性快捷</h3>
              <button @click="maxAllStats" class="btn btn-warning">一键满属性</button>
              <button @click="maxMoney" class="btn btn-warning">金钱最大化</button>
              <button @click="clearStress" class="btn btn-warning">压力清零</button>
              <button @click="maxActionPower" class="btn btn-warning">行动力全满</button>
            </div>

            <div class="action-group">
              <h3>NPC快捷</h3>
              <button @click="maxAllFavorability" class="btn btn-warning">全NPC满好感</button>
            </div>

            <div class="action-group">
              <h3>技能快捷</h3>
              <button @click="unlockAllSkills" class="btn btn-warning">解锁全部技能</button>
            </div>

            <div class="action-group">
              <h3>其他</h3>
              <button @click="setMonth42" class="btn btn-warning">跳到最终月</button>
              <button @click="resetToMonth0" class="btn btn-warning">重置到初始月</button>
            </div>
          </div>
        </section>
      </main>
    </div>

    <div v-else class="welcome-screen">
      <div class="welcome-content">
        <h2>欢迎使用 Magical Princess 存档编辑器</h2>
        <p>点击「导入存档」按钮开始编辑</p>
        <p class="hint">存档位置：%USERPROFILE%/AppData/LocalLow/[公司名]/Magical Princess/</p>
        <p class="hint">存档文件格式：v10_userdata1.dat ~ v10_userdata31.dat</p>
      </div>
    </div>

    <footer class="footer" v-if="saveData">
      <span>存档槽位: {{ saveData.saveSlotId }} | {{ getPeriodText(saveData.status.period) }} | 金钱: {{ saveData.status.money }}</span>
    </footer>
  </div>
</template>

<script>
import { ref, reactive } from 'vue'
import { parseSaveFile, serializeSaveFile, createEmptySaveData, getPeriodText } from './utils/saveParser.js'
import { CharaType, AcademyClass } from './data/enums.js'
import { ItemNames, FriendNames, FriendJobs, SkillNames, BattleArtsNames, ActivityNames, CurriculumNames } from './data/gameData.js'

export default {
  name: 'App',
  setup() {
    const saveData = ref(null)
    const fileInput = ref(null)
    const activeTab = ref('basic')

    const menuItems = [
      { id: 'basic', label: '基础属性' },
      { id: 'detailed', label: '详细属性' },
      { id: 'equipment', label: '装备' },
      { id: 'npc', label: 'NPC' },
      { id: 'items', label: '物品' },
      { id: 'skills', label: '技能' },
      { id: 'global', label: '轮回数据' },
      { id: 'quick', label: '快捷操作' }
    ]

    const importSave = () => {
      fileInput.value.click()
    }

    const handleFileImport = async (event) => {
      const file = event.target.files[0]
      if (!file) return

      try {
        const text = await file.text()
        saveData.value = parseSaveFile(text)
        alert('存档加载成功！')
      } catch (e) {
        alert('加载失败：' + e.message)
      }
      event.target.value = ''
    }

    const exportSave = () => {
      if (!saveData.value) return

      try {
        const encrypted = serializeSaveFile(saveData.value)
        const blob = new Blob([encrypted], { type: 'text/plain' })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `v10_userdata${saveData.value.saveSlotId || 1}.dat`
        a.click()
        URL.revokeObjectURL(url)
        alert('存档导出成功！')
      } catch (e) {
        alert('导出失败：' + e.message)
      }
    }

    const getCharaName = (id) => {
      const name = FriendNames[id] || CharaType[id] || `未知(${id})`
      const job = FriendJobs[id]
      return job ? `${name} - ${job}` : name
    }

    const getItemName = (id) => {
      if (id === -1 || id === undefined || id === null) return '未装备'
      return ItemNames[id] || `物品#${id}`
    }

    const getSkillName = (id) => {
      return SkillNames[id] || `技能#${id}`
    }

    const getActivityName = (id) => {
      return ActivityNames[id] || `活动#${id}`
    }

    const getCurriculumName = (id) => {
      return CurriculumNames[id] || `课程#${id}`
    }

    const addItem = () => {
      saveData.value.itemDataParamList.push({
        itemId: 0,
        count: 1,
        useCount: 0,
        getCount: 0,
        isCraft: false,
        monthStock: 0,
        countTemp: 0,
        isShowGetEffect: false
      })
    }

    const removeItem = (index) => {
      saveData.value.itemDataParamList.splice(index, 1)
    }

    const addSkill = () => {
      saveData.value.skillDataParamList.push({
        skillId: 0,
        isOpened: false,
        isLearned: false
      })
    }

    const removeSkill = (index) => {
      saveData.value.skillDataParamList.splice(index, 1)
    }

    // 快捷操作
    const maxAllStats = () => {
      const s = saveData.value.status
      s.levelPhysical = 10
      s.levelIntelligence = 10
      s.levelCharm = 10
      s.levelSense = 10
      s.phyKinryoku = 999
      s.phySeimei = 999
      s.phyKonjyo = 999
      s.phyBinsho = 999
      s.intBungaku = 999
      s.intSanjyutsu = 999
      s.intMajyutsu = 999
      s.intShinkou = 999
      s.chaBibou = 999
      s.chaShakou = 999
      s.chaReigi = 999
      s.chaDoutoku = 999
      s.senSouzou = 999
      s.senSousaku = 999
      s.senOnkan = 999
      s.senBikan = 999
      s.levelBattle = 10
      s.levelArts = 10
      s.levelMagic = 10
      alert('属性已最大化！')
    }

    const maxMoney = () => {
      saveData.value.status.money = 9999999
      alert('金钱已最大化！')
    }

    const clearStress = () => {
      saveData.value.status.stress = 0
      alert('压力已清零！')
    }

    const maxActionPower = () => {
      saveData.value.status.activePower = 99
      saveData.value.status.activePowerMax = 99
      alert('行动力已全满！')
    }

    const maxAllFavorability = () => {
      saveData.value.friendDataParamList.forEach(npc => {
        npc.fFavarite = 100
      })
      alert('全部NPC好感度已最大化！')
    }

    const unlockAllSkills = () => {
      saveData.value.skillDataParamList.forEach(skill => {
        skill.isOpened = true
        skill.isLearned = true
      })
      alert('全部技能已解锁！')
    }

    const setMonth42 = () => {
      saveData.value.status.period = 42
      alert('已跳到最终月！')
    }

    const resetToMonth0 = () => {
      saveData.value.status.period = 0
      alert('已重置到初始月！')
    }

    return {
      saveData,
      fileInput,
      activeTab,
      menuItems,
      importSave,
      handleFileImport,
      exportSave,
      getCharaName,
      getItemName,
      getSkillName,
      getActivityName,
      getCurriculumName,
      addItem,
      removeItem,
      addSkill,
      removeSkill,
      getPeriodText,
      AcademyClass,
      CharaType,
      ItemNames,
      FriendNames,
      SkillNames,
      ActivityNames,
      CurriculumNames,
      maxAllStats,
      maxMoney,
      clearStress,
      maxActionPower,
      maxAllFavorability,
      unlockAllSkills,
      setMonth42,
      resetToMonth0
    }
  }
}
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Segoe UI', 'Microsoft YaHei', sans-serif;
  background: #1a1a2e;
  color: #eee;
  min-height: 100vh;
}

.app {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 1rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 2px 10px rgba(0,0,0,0.3);
}

.header h1 {
  font-size: 1.5rem;
  font-weight: 600;
}

.header-actions {
  display: flex;
  gap: 0.5rem;
}

.btn {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.9rem;
  transition: all 0.2s;
}

.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn-primary {
  background: #4CAF50;
  color: white;
}

.btn-primary:hover:not(:disabled) {
  background: #45a049;
}

.btn-success {
  background: #2196F3;
  color: white;
}

.btn-success:hover:not(:disabled) {
  background: #1976D2;
}

.btn-warning {
  background: #ff9800;
  color: white;
}

.btn-warning:hover {
  background: #f57c00;
}

.btn-danger {
  background: #f44336;
  color: white;
}

.btn-danger:hover {
  background: #d32f2f;
}

.btn-small {
  padding: 0.25rem 0.5rem;
  font-size: 0.8rem;
}

.main-content {
  display: flex;
  flex: 1;
}

.sidebar {
  width: 180px;
  background: #16213e;
  padding: 1rem 0;
}

.nav-list {
  list-style: none;
}

.nav-list li {
  padding: 0.75rem 1.5rem;
  cursor: pointer;
  transition: all 0.2s;
  border-left: 3px solid transparent;
}

.nav-list li:hover {
  background: rgba(255,255,255,0.1);
}

.nav-list li.active {
  background: rgba(102, 126, 234, 0.3);
  border-left-color: #667eea;
  color: #667eea;
}

.content {
  flex: 1;
  padding: 1.5rem;
  overflow-y: auto;
}

.editor-section {
  max-width: 1200px;
}

.editor-section h2 {
  margin-bottom: 1.5rem;
  color: #667eea;
  border-bottom: 2px solid #667eea;
  padding-bottom: 0.5rem;
}

.subsection {
  margin-top: 1.5rem;
  padding: 1rem;
  background: rgba(255,255,255,0.05);
  border-radius: 8px;
}

.subsection h3 {
  margin-bottom: 1rem;
  color: #9c88ff;
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.form-group label {
  font-size: 0.85rem;
  color: #aaa;
}

.form-group input,
.form-group select {
  padding: 0.5rem;
  border: 1px solid #444;
  border-radius: 4px;
  background: #2a2a4a;
  color: #eee;
  font-size: 0.9rem;
}

.form-group input:focus,
.form-group select:focus {
  outline: none;
  border-color: #667eea;
}

.form-group input[type="checkbox"] {
  width: 18px;
  height: 18px;
  cursor: pointer;
}

.hint {
  font-size: 0.75rem;
  color: #888;
}

.input-with-text {
  display: flex;
  gap: 0.5rem;
  align-items: center;
}

.input-with-text input {
  flex: 1;
}

.npc-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1rem;
}

.npc-card {
  background: rgba(255,255,255,0.05);
  border-radius: 8px;
  padding: 1rem;
}

.npc-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.75rem;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid #444;
}

.npc-name {
  font-weight: 600;
  color: #9c88ff;
}

.npc-id {
  font-size: 0.8rem;
  color: #888;
}

.npc-fields {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.5rem;
}

.data-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 1rem;
}

.data-table th,
.data-table td {
  padding: 0.75rem;
  text-align: left;
  border-bottom: 1px solid #444;
}

.data-table th {
  background: rgba(255,255,255,0.1);
  font-weight: 600;
}

.data-table input[type="number"] {
  width: 80px;
  padding: 0.25rem;
  border: 1px solid #444;
  border-radius: 4px;
  background: #2a2a4a;
  color: #eee;
}

.data-table input[type="checkbox"] {
  width: 18px;
  height: 18px;
}

.list-controls {
  margin-bottom: 1rem;
}

.checkbox-group {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
}

.checkbox-group label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
}

.quick-actions {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 1.5rem;
}

.action-group {
  background: rgba(255,255,255,0.05);
  padding: 1rem;
  border-radius: 8px;
}

.action-group h3 {
  margin-bottom: 1rem;
  color: #ff9800;
}

.action-group button {
  display: block;
  width: 100%;
  margin-bottom: 0.5rem;
}

.warning {
  background: rgba(244, 67, 54, 0.2);
  border: 1px solid #f44336;
  padding: 0.75rem;
  border-radius: 4px;
  margin-bottom: 1.5rem;
  color: #ffcdd2;
}

.welcome-screen {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
}

.welcome-content {
  text-align: center;
  padding: 2rem;
}

.welcome-content h2 {
  color: #667eea;
  margin-bottom: 1rem;
}

.welcome-content p {
  margin: 0.5rem 0;
}

.footer {
  background: #16213e;
  padding: 0.75rem 2rem;
  text-align: center;
  font-size: 0.85rem;
  color: #888;
}

.item-name-cell {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.item-name {
  font-weight: 600;
  color: #9c88ff;
}

.id-input {
  width: 60px !important;
  font-size: 0.75rem !important;
  padding: 0.15rem !important;
  opacity: 0.7;
}

.equip-item {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.equip-name {
  font-weight: 600;
  color: #9c88ff;
  font-size: 1rem;
}
</style>
