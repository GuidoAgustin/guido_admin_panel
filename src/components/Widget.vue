<template>
  <div class="card widget h-auto" :class="{ 'widget-plain': plain }">
    <div class="card-header" v-if="icon || $slots.title || $slots.buttons">
      <slot name="pretitle" />

      <i class="widget-icon" :class="icon" v-if="icon"></i>
      <h3><slot name="title"></slot></h3>
      <small class="widget-desc" v-if="$slots.description"><slot name="description" /></small>

      <div class="buttons" v-if="$slots.buttons"><slot name="buttons"> </slot></div>
    </div>
    <div class="card-body">
      <slot>
        <div class="widget-loader"></div>
      </slot>
    </div>
    <slot name="footer"></slot>
  </div>
</template>

<script>
export default {
  props: {
    icon: {
      type: String,
      default: null
    },
    plain: Boolean
  }
}
</script>

<style></style>
