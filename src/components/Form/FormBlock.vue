<template>
  <div class="form-container form-block" :class="{ disabled, 'flex-field': flexField }">
    <label :for="itemId" v-if="label">{{ label }}</label>
    <div class="form-wrapper">
      <div class="icon" v-if="icon">
        <i :class="icon"></i>
      </div>

      <div class="flex-1" style="min-height: 32px">
        <slot />
      </div>

      <slot name="button"></slot>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    modelValue: {
      type: String,
      default: null
    },
    label: String,
    icon: {
      type: String,
      default: null
    },
    disabled: {
      type: Boolean,
      default: false
    },
    flexField: {
      type: Boolean,
      default: false
    }
  },
  data: () => ({
    itemId: null
  })
}
</script>

<style></style>
