<template>
  <section class="editor-section">
    <h2 class="section-title">装备</h2>
    <n-form :model="status" label-placement="left" label-width="120">
      <n-grid :cols="24" :x-gap="24" :y-gap="12" responsive="screen">
        <n-form-item-gi :span="8" label="服装">
          <div class="equip-item">
            <span class="equip-name">{{ clothName }}</span>
            <n-input-number v-model:value="status.equipCloth" :min="-1" />
            <span class="hint">-1 = 未装备</span>
          </div>
        </n-form-item-gi>
        <n-form-item-gi :span="8" label="武器">
          <div class="equip-item">
            <span class="equip-name">{{ weaponName }}</span>
            <n-input-number v-model:value="status.equipWeapon" :min="-1" />
            <span class="hint">-1 = 未装备</span>
          </div>
        </n-form-item-gi>
        <n-form-item-gi :span="8" label="防具">
          <div class="equip-item">
            <span class="equip-name">{{ armorName }}</span>
            <n-input-number v-model:value="status.equipArmor" :min="-1" />
            <span class="hint">-1 = 未装备</span>
          </div>
        </n-form-item-gi>
      </n-grid>
    </n-form>
  </section>
</template>

<script>
import { computed } from 'vue'
import { NForm, NGrid, NFormItemGi, NInputNumber } from 'naive-ui'
import { ItemNames } from '../data/gameData.js'

export default {
  name: 'EquipmentEditor',
  components: { NForm, NGrid, NFormItemGi, NInputNumber },
  props: {
    status: {
      type: Object,
      required: true
    }
  },
  setup(props) {
    const getItemName = (id) => {
      if (id === -1 || id === undefined || id === null) return '未装备'
      return ItemNames[id] || `物品#${id}`
    }
    
    const clothName = computed(() => getItemName(props.status.equipCloth))
    const weaponName = computed(() => getItemName(props.status.equipWeapon))
    const armorName = computed(() => getItemName(props.status.equipArmor))
    
    return { clothName, weaponName, armorName }
  }
}
</script>

<style scoped>
.editor-section { max-width: 1200px; }
.section-title {
  margin-bottom: 1.5rem;
  color: #667eea;
  border-bottom: 2px solid #667eea;
  padding-bottom: 0.5rem;
}
.equip-item {
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: 100%;
}
.equip-name {
  font-weight: 600;
  color: #9c88ff;
  font-size: 1.1rem;
}
.hint { font-size: 0.75rem; color: #888; }
</style>