<template>
  <FormDropdown position="bottom">
    <template #action="{ open }">
      <button
        class="btn btn-sm btn-borderless-dark"
        @click="open"
        ref="button"
        style="position: relative"
      >
        <i class="fa fa-ellipsis"></i>
      </button>
    </template>
    <template #default="{ close }">
      <slot :close="close"></slot>
    </template>
  </FormDropdown>
</template>

<script>
import FormDropdown from '@/components/Form/FormDropdown.vue'

export default {
  components: {
    FormDropdown
  }
}
</script>
