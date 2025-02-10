<template>
  <div class="he-sidemenu he-props" :class="{ open }">
    <div class="he-close" @click="close">
      <span class="material-symbols-outlined">double_arrow</span>
    </div>
    <div class="he-title"><h6>Row properties</h6></div>
    <div class="he-wrapper">
      <RowLayoutPropSection v-model="cols" />
      <RowPropSection v-model="row" />
      <ColumnsPropSection
        v-model="cols"
        :selectedColIndex="selectedColIndex"
        v-if="cols.length"
        :key="selectedColIndex || 'undef'"
      />
    </div>
  </div>
</template>

<script>
import RowLayoutPropSection from '../Properties/RowLayoutPropSection.vue'
import ColumnsPropSection from '../Properties/ColumnsPropSection.vue'
import RowPropSection from '../Properties/RowPropSection.vue'

export default {
  components: {
    RowLayoutPropSection,
    ColumnsPropSection,
    RowPropSection
  },
  emits: ['close'],
  props: {
    modelValue: {
      type: Object,
      defaultValue: () => ({ style: {} })
    },
    selectedColIndex: Number
  },
  data: () => ({
    open: false
  }),
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
        return this.row?.child?.child?.child?.children || []
      },
      set(val) {
        this.row.child.child.child.children = val
      }
    }
  },
  mounted() {
    setTimeout(() => {
      this.open = true
    }, 10)
  },
  methods: {
    close() {
      this.open = false
      setTimeout(() => {
        this.$emit('close')
      }, 250)
    }
  }
}
</script>

<style></style>
