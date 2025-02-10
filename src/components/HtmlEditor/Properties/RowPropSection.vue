<template>
  <Accordion title="Row Properties" open-on-init>
    <BackgroundProps v-model="result.style" />
    <BorderProps v-model="result.style" />
    <HeightProps v-model="result.style" />
    <VerticalAlignProps v-model="result.child.style" />
  </Accordion>
</template>

<script>
import Accordion from '@/components/Accordion.vue'
import BorderProps from './BorderProps.vue'
import BackgroundProps from './BackgroundProps.vue'
import HeightProps from './HeightProps.vue'
import VerticalAlignProps from './VerticalAlignProps.vue'

export default {
  components: {
    Accordion,
    BackgroundProps,
    BorderProps,
    HeightProps,
    VerticalAlignProps
  },
  props: {
    modelValue: Object
  },
  emits: ['update:modelValue'],
  data: () => ({}),
  computed: {
    result: {
      get() {
        return { ...this.modelValue }
      },
      set(val) {
        this.$emit('update:modelValue', val)
      }
    }
  }
}
</script>

<style></style>
