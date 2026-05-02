<template>
  <section class="editor-section">
    <h2 class="section-title">装备</h2>
    <div class="card-grid">
      <div class="card-grid-item card-grid-item--full">
        <n-card title="角色装备" size="small">
          <n-form :model="status" label-placement="top">
            <n-grid :cols="24" :x-gap="24" :y-gap="12" responsive="screen">
              <n-form-item-gi span="24 s:12 l:8" label="服装">
                <n-select
                  v-model:value="status.equipCloth"
                  :options="clothOptions"
                  filterable
                  placeholder="选择服装"
                />
              </n-form-item-gi>
              <n-form-item-gi span="24 s:12 l:8" label="武器">
                <n-select
                  v-model:value="status.equipWeapon"
                  :options="weaponOptions"
                  filterable
                  placeholder="选择武器"
                />
              </n-form-item-gi>
              <n-form-item-gi span="24 s:12 l:8" label="饰品">
                <n-select
                  v-model:value="status.equipArmor"
                  :options="armorOptions"
                  filterable
                  placeholder="选择饰品"
                />
              </n-form-item-gi>
            </n-grid>
          </n-form>
        </n-card>
      </div>
    </div>
  </section>
</template>

<script>
import { computed } from 'vue'
import { NForm, NGrid, NFormItemGi, NSelect } from 'naive-ui'
import { ItemNames, EquipmentRanges } from '../data/gameData.js'

export default {
  name: 'EquipmentEditor',
  components: { NForm, NGrid, NFormItemGi, NSelect },
  props: {
    status: {
      type: Object,
      required: true
    },
    itemList: {
      type: Array,
      default: () => []
    }
  },
  setup(props) {
    const getItemCount = (itemId) => {
      const item = props.itemList.find(i => i.itemId === itemId)
      return item ? item.count : 0
    }

    const buildOptions = (range) => {
      const options = [{ label: '未装备', value: -1 }]
      for (const id of range.ids) {
        if (ItemNames[id]) {
          const count = getItemCount(id)
          options.push({
            label: `${ItemNames[id]} (#${id}) [${count}]`,
            value: id,
            disabled: count < 1
          })
        }
      }
      return options
    }

    const clothOptions = computed(() => buildOptions(EquipmentRanges.cloth))
    const weaponOptions = computed(() => buildOptions(EquipmentRanges.weapon))
    const armorOptions = computed(() => buildOptions(EquipmentRanges.armor))
    
    return { clothOptions, weaponOptions, armorOptions }
  }
}
</script>

