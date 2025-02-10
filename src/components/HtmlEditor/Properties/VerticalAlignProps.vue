<template>
  <div class="d-flex justify-content-between align-items-center">
    <h6 class="label">Vertical align</h6>
  </div>

  <FormSelect
    flex-field
    label="Column Vertical Align"
    v-model="vertical_align"
    :options="vAlignOpts"
  />
</template>

<script>
import FormSelect from '@/components/Form/FormSelect.vue'

export default {
  components: { FormSelect },
  props: { modelValue: { type: Object } },
  emits: ['update:modelValue'],
  data: () => ({
    vertical_align: null,
    vAlignOpts: ['top', 'middle', 'bottom']
  }),
  watch: {
    vertical_align(val) {
      this.result.verticalAlign = val
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
    if (this.modelValue && this.modelValue.verticalAlign) {
      this.vertical_align = this.modelValue.verticalAlign
    }
  }
}
</script>
