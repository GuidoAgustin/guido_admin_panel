<template>
  <div>
    <FormText label="Name" v-model="result.name" />
  </div>
</template>

<script>
import FormText from '@/components/Form/FormText.vue'

export default {
  components: {
    FormText
  },
  props: {
    form: Object
  },
  computed: {
    result: {
      get() {
        return this.form
      },
      set(val) {
        this.$emit('update:form', val)
      }
    }
  }
}
</script>

<style></style>
