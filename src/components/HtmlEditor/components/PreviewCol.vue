<template>
  <Draggable
    v-model="col.children"
    group="he-col-content"
    tag="td"
    itemKey="key"
    class="he-col"
    :style="colStyles"
  >
    <template #item="{ element, index }">
      <div class="he-element-wrapper">
        <DynamicElement :element="element" @click.stop="$emit('openElementProps', element)" />

        <button class="remove-el" @click.stop="$emit('removeElement', index)">
          <div class="material-symbols-outlined">delete</div>
        </button>
      </div>
    </template>
    <template #footer>
      <div class="empty" v-if="!col.children.length">Empty column. Drag content from toolbar</div>
    </template>
  </Draggable>
</template>

<script>
import Draggable from 'vuedraggable'
import DynamicElement from './DynamicElement.vue'

export default {
  components: { Draggable, DynamicElement },
  props: {
    modelValue: Object
  },
  emits: ['update:modelValue', 'openElementProps', 'removeElement'],
  computed: {
    col: {
      get() {
        return this.modelValue
      },
      set(val) {
        this.$emit('update:modelValue', val)
      }
    },
    colStyles() {
      if (typeof this.col.style === 'string') {
        return this.col.style
      }

      return Object.fromEntries(
        // eslint-disable-next-line no-unused-vars
        Object.entries(this.col.style).filter(([_, value]) => value !== undefined)
      )
    }
  }
}
</script>

<style></style>
