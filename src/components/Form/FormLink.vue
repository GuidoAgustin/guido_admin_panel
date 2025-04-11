<template>
  <div class="form-container form-link" :class="{ disabled, 'flex-field': flexField }">
    <label :for="itemId" v-if="label">{{ label }}</label>
    <div class="form-wrapper">
      <div class="icon" v-if="icon">
        <i :class="icon"></i>
      </div>

      <router-link class="link-dark link-underlined" :to="to">
        <slot />
      </router-link>
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
    to: {
      type: [String, Object],
      default: null
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
