<template>
  <tr class="he-row editable" @click="$emit('openRowProps', index)" :style="row.style" v-if="cols">
    <td :style="row.child.style">
      <table>
        <Draggable v-model="cols" group="he-cols" tag="tr" itemKey="key">
          <template #item="{ index: colIndex }">
            <PreviewCol
              v-model="cols[colIndex]"
              :key="cols[colIndex].key"
              @click.stop="$emit('openRowProps', index, colIndex)"
              @openElementProps="$emit('openElementProps', $event)"
              @removeElement="
                $emit('removeElement', {
                  elementIndex: $event,
                  colIndex
                })
              "
            />
          </template>
          <template #footer>
            <td v-if="!cols?.length">
              <div class="empty">Empty row. Click to see Properties</div>
            </td>
          </template>
        </Draggable>
      </table>
      <button class="add-row add-before" @click.stop="$emit('addRow', index, true)">
        <div class="material-symbols-outlined">add</div>
      </button>
      <button class="add-row" @click.stop="$emit('addRow', index)">
        <div class="material-symbols-outlined">add</div>
      </button>
      <button class="remove-row" @click.stop="$emit('removeRow', index)">
        <div class="material-symbols-outlined">delete</div>
      </button>
      <button class="save-row" @click.stop="$emit('saveRow', row)">
        <div class="material-symbols-outlined">save</div>
      </button>
    </td>
  </tr>
</template>

<script>
import Draggable from 'vuedraggable'
import PreviewCol from './PreviewCol.vue'

export default {
  components: { Draggable, PreviewCol },
  props: {
    modelValue: Object,
    index: Number
  },
  emits: [
    'update:modelValue',
    'addRow',
    'removeRow',
    'saveRow',
    'openRowProps',
    'openElementProps',
    'removeElement'
  ],
  computed: {
    row: {
      get() {
        return this.modelValue
      },
      set(val) {
        this.$emit('update:modelValue', val)
      }
    },
    cols: {
      get() {
        return this.row?.child?.child?.child?.children
      },
      set(val) {
        const aux = this.row
        aux.child.child.child.children = val

        this.row = aux
      }
    }
  }
}
</script>

<style></style>
