<template>
  <div class="draggable-list-wrapper">
    <draggable
      v-model="result"
      handle=".drag-handle"
      :group="group || `draggroup_${listId}`"
      :itemKey="itemKey || 'id'"
      class="draggable-list"
      v-if="listId"
      @change="$emit('listChanged', $event)"
    >
      <template #item="{ element, index }">
        <DraggableListItem :disabled="disabled">
          <slot :item="element" :index="index" />
        </DraggableListItem>
      </template>

      <template #footer v-if="$slots.footer">
        <slot name="footer" />
      </template>
    </draggable>

    <div class="default-message" v-if="!$slots.footer && !result.length">{{ noItemsMsg }}</div>
  </div>
</template>

<script>
import draggable from 'vuedraggable'
import DraggableListItem from './DraggableListItem.vue'

export default {
  components: {
    draggable,
    DraggableListItem
  },
  props: {
    modelValue: Array,
    group: String,
    itemKey: [String, Number],
    sortKey: {
      type: String,
      default: 'sort'
    },
    disabled: Boolean,
    noItemsMsg: {
      type: String,
      default: 'Drag items here'
    }
  },
  computed: {
    result: {
      get() {
        return [...this.modelValue]
      },
      set(val) {
        const aux = val.map((x, i) => {
          x[this.sortKey] = i + 1
          return x
        })
        this.$emit('update:modelValue', aux)
      }
    }
  },
  data: () => ({
    listId: null
  }),
  mounted() {
    this.listId = Math.floor(Math.random() * Date.now())
  }
}
</script>

<style></style>
