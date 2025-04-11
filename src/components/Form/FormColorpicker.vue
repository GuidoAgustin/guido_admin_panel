<template>
  <div
    class="form-container form-colorpicker"
    :class="{ disabled, small, 'flex-field': flexField }"
  >
    <label :for="itemId" v-if="label">{{ label }}</label>

    <div
      class="color-picker"
      :class="{ 'no-color': !pickerBg }"
      :style="{ backgroundColor: pickerBg }"
      @click="$refs.picker.pickStart()"
    >
      <color-input
        v-model="result"
        format="hex string"
        ref="picker"
        :appendTo="'#modal-container'"
      />

      <button @click.stop="result = null">&times;</button>
    </div>
  </div>
</template>

<script>
import ColorInput from 'vue-color-input'

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
    small: {
      type: Boolean,
      default: false
    },
    flexField: {
      type: Boolean,
      default: false
    }
  },
  components: {
    ColorInput
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
    },
    pickerBg() {
      return this.result
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
