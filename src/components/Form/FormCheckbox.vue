<template>
  <div class="form-container form-checkbox" :class="{ disabled, small }">
    <input type="checkbox" :id="itemId" v-model="result" :value="value" />
    <label :for="itemId" v-if="label">{{ label }}</label>
  </div>
</template>

<script>
export default {
  props: {
    modelValue: {
      type: [Boolean, Array],
      default: null
    },
    value: {
      type: [String, Number, Object],
      default: null
    },
    label: {
      type: String
    },
    disabled: {
      type: Boolean,
      default: false
    },
    small: {
      type: Boolean,
      default: false
    }
  },
  data: () => ({
    itemId: null
  }),
  computed: {
    result: {
      get() {
        return this.modelValue
      },
      set(value) {
        this.$emit('update:modelValue', value)
      }
    }
  },
  mounted() {
    this.fillId()
  },
  methods: {
    fillId() {
      this.itemId = Math.floor(Math.random() * Date.now())
    }
  }
}
</script>

<style></style>
