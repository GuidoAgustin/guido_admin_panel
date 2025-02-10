<template>
  <div class="d-flex justify-content-between align-items-center">
    <h6 class="label">HTML</h6>
  </div>
  <div class="text-muted">Remember to use inline styles</div>

  <FormCode label="Inner HTML" v-model="inner_html" />
</template>

<script>
import FormCode from '@/components/Form/FormCode.vue'

export default {
  components: { FormCode },
  props: { modelValue: { type: Object } },
  emits: ['update:modelValue'],
  data: () => ({
    inner_html: null,
    style: null
  }),
  watch: {
    inner_html(val) {
      this.result.innerHtml = val
    },
    style(val) {
      this.result.style = val
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
    if (this.modelValue) {
      Object.keys(this.modelValue).forEach((key) => {
        if (key === 'innerHtml') {
          this.inner_html = this.modelValue[key]
        }
        if (key === 'style') {
          this.style = this.modelValue[key]
        }
      })
    }
  }
}
</script>
