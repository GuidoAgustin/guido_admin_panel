<template>
  <div class="drag-list-item" :class="{ 'drag-list-item-disabled': disabled }">
    <div class="drag-handle">
      <span class="material-symbols-outlined icon-bold"> drag_indicator </span>
    </div>
    <div class="list-item-content">
      <slot />
    </div>
  </div>
</template>

<script>
export default {
  props: {
    disabled: Boolean
  }
}
</script>
