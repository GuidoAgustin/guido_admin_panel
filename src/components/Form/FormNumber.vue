<template>
  <div class="form-container" :class="{ disabled, 'flex-field': flexField }">
    <label :for="itemId" v-if="label">
      {{ label }} <small v-if="description">{{ description }}</small>
    </label>
    <div class="form-wrapper">
      <slot name="icon">
        <div class="icon" v-if="icon">
          <i :class="icon"></i>
        </div>
      </slot>
      <input
        :type="inputType"
        placeholder=" "
        :id="itemId"
        v-model="result"
        :disabled="disabled"
        @focus="onFocus"
        @blur="onBlur"
        @change="$emit('onChange', $event.target.value)"
      />
      <slot />
    </div>
  </div>
</template>

<script>
import { formatToMoney } from '@/utils/string'

export default {
  props: {
    modelValue: {
      type: [Number, String],
      default: null
    },
    label: String,
    description: String,
    icon: {
      type: [String, Object],
      default: null
    },
    disabled: {
      type: Boolean,
      default: false
    },
    flexField: {
      type: Boolean,
      default: false
    },
    selectOnFocus: Boolean,
    moneyFormat: Boolean,
    max: Number,
    min: Number
  },
  data: () => ({
    itemId: null,
    inputType: 'number',
    result: null
  }),
  mounted() {
    this.fillId()
  },
  watch: {
    moneyFormat(val) {
      if (val) {
        this.inputType = 'text'

        this.$nextTick(() => {
          this.result = formatToMoney(this.modelValue)
        })
      }
    },
    modelValue: {
      immediate: true,
      handler(val) {
        if (val === null || val === undefined) return

        let aux = this.modelValue

        if (this.moneyFormat) {
          this.inputType = 'text'
          aux = formatToMoney(this.modelValue)
        }

        this.$nextTick(() => {
          this.result = aux
        })
      }
    }
  },
  methods: {
    updateResult() {
      this.result = this.modelValue
    },
    fillId() {
      this.itemId = Math.floor(Math.random() * Date.now())
    },
    onFocus(e) {
      if (this.moneyFormat) {
        // Show raw number when focused
        this.inputType = 'number'
        this.result = this.modelValue
      }

      this.$nextTick(() => {
        if (this.selectOnFocus) e.target.select()
      })
    },
    onBlur(e) {
      let aux = parseFloat(parseFloat(e.target.value).toFixed(2))

      if (this.max !== undefined && aux > this.max) {
        aux = this.max
      }
      if (this.min !== undefined && aux < this.min) {
        aux = this.min
      }

      this.$emit('update:modelValue', aux)

      if (this.moneyFormat) {
        this.inputType = 'text'
        this.$nextTick(() => {
          this.result = formatToMoney(aux)
        })
      }
    }
  }
}
</script>

<style></style>
