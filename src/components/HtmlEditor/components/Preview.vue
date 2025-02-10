<template>
  <div class="he-preview" :class="{ 'preview-mobile': isMobile }">
    <div class="he-preview-wrapper">
      <Draggable
        v-model="result"
        group="he-rows"
        itemKey="key"
        class="he-table"
        :class="`format-${format}`"
        tag="table"
      >
        <template #item="{ index: rowIndex }">
          <PreviewRow
            v-model="result[rowIndex]"
            :index="rowIndex"
            @addRow="addRow"
            @removeRow="removeRow"
            @openRowProps="openRowProps"
            @openElementProps="$emit('openElementProps', $event)"
            @saveRow="$emit('saveRow', $event)"
            @removeElement="
              $emit('removeElement', {
                ...$event,
                rowIndex
              })
            "
          />
        </template>
        <template #footer>
          <tr class="he-row" v-if="!result.length">
            <td>
              <div class="empty">
                <span>Empty template.</span>
                <button @click="addRow()">Add row</button>
              </div>
            </td>
          </tr>
        </template>
      </Draggable>
    </div>
  </div>
</template>

<script>
import Draggable from 'vuedraggable'
import PreviewRow from './PreviewRow.vue'

export default {
  components: {
    Draggable,
    PreviewRow
  },
  props: {
    modelValue: {
      type: Array,
      default: () => []
    },
    isMobile: Boolean,
    format: String
  },
  emits: [
    'update:modelValue',
    'addRow',
    'removeRow',
    'openRowProps',
    'saveRow',
    'openElementProps',
    'removeElement'
  ],
  computed: {
    result: {
      get() {
        return [...this.modelValue]
      },
      set(val) {
        this.$emit('update:modelValue', val)
      }
    }
  },
  methods: {
    addRow(index, before = false) {
      this.$emit('addRow', {
        index,
        before
      })
    },
    removeRow(index) {
      this.$emit('removeRow', index)
    },
    openRowProps(rowIndex, colIndex) {
      this.$emit('openRowProps', rowIndex, colIndex)
    }
  }
}
</script>

<style></style>
