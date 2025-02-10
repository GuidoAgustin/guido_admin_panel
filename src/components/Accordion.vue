<template>
  <div class="accordion" :class="{ 'accordion-open': openStatus, 'accordion-error': hasError }">
    <div class="accordion-head" @click="toggle">
      <span>{{ title }}</span>
      <span class="arrow material-symbols-outlined">keyboard_arrow_down</span>
    </div>
    <div class="accordion-body">
      <div class="accordion-container">
        <slot />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    title: String,
    hasError: Boolean,
    openOnInit: Boolean
  },
  emits: ['onClose', 'onOpen'],
  data: () => ({
    openStatus: false
  }),
  mounted() {
    this.openStatus = this.openOnInit
  },
  methods: {
    toggle() {
      if (this.openStatus) {
        this.close()
      } else {
        this.open()
      }
    },
    close() {
      this.$emit('onClose')
      this.openStatus = false
    },
    open() {
      this.$emit('onOpen')
      this.openStatus = true
    }
  }
}
</script>

<style></style>
