<template>
  <div>
    <FormText label="Name2" v-model="result.name" />
    <FormText label="Email" v-model="result.email" />
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
