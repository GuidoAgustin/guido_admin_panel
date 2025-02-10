<template>
  <div class="d-flex justify-content-between align-items-center">
    <h6 class="label">Height</h6>
  </div>

  <FormNumber flex-field label="Row height" v-model="height">
    <div class="unit">px</div>
  </FormNumber>
</template>

<script>
import FormNumber from '@/components/Form/FormNumber.vue'

export default {
  components: { FormNumber },
  props: { modelValue: { type: Object } },
  emits: ['update:modelValue'],
  data: () => ({
    height: null
  }),
  watch: {
    height(val) {
      if (!val) {
        this.result.height = undefined
      } else {
        this.result.height = `${val}px`
      }
    }
  },
  computed: {
    result: {
      get() {
        return this.modelValue
      },
      set(val) {
        this.$emit('update:modelValue', val)
      }
    }
  },
  mounted() {
    if (this.modelValue && this.modelValue.height) {
      this.height = this.modelValue.height.slice(0, -2)
    }
  }
}
</script>
