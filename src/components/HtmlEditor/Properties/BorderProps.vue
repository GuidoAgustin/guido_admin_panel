<template>
  <div class="d-flex justify-content-between align-items-center">
    <h6 class="label">Border</h6>
    <FormSwitch label="More options" flex-field small v-model="extended" />
  </div>
  <template v-if="!extended">
    <FormNumber label="Border All sides" flex-field v-model="border.size">
      <div class="unit">px</div>
    </FormNumber>
    <FormColorpicker label="Border color All sides" flex-field v-model="border.color" />
  </template>

  <template v-else>
    <FormNumber label="Border Top" v-model="border_top.size" flex-field>
      <div class="unit">px</div>
    </FormNumber>
    <FormColorpicker class="mb-3" label="Border color Top" v-model="border_top.color" flex-field />
    <FormNumber label="Border Bottom" flex-field v-model="border_bottom.size">
      <div class="unit">px</div>
    </FormNumber>
    <FormColorpicker
      class="mb-3"
      label="Border color Bottom"
      flex-field
      v-model="border_bottom.color"
    />
    <FormNumber label="Border Left" flex-field v-model="border_left.size">
      <div class="unit">px</div>
    </FormNumber>
    <FormColorpicker
      class="mb-3"
      label="Border color Left"
      flex-field
      v-model="border_left.color"
    />
    <FormNumber label="Border Right" flex-field v-model="border_right.size">
      <div class="unit">px</div>
    </FormNumber>
    <FormColorpicker
      class="mb-3"
      label="Border color Right"
      flex-field
      v-model="border_right.color"
    />
  </template>
</template>

<script>
import FormSwitch from '@/components/Form/FormSwitch.vue'
import FormColorpicker from '@/components/Form/FormColorpicker.vue'
import FormNumber from '@/components/Form/FormNumber.vue'

export default {
  components: {
    FormSwitch,
    FormColorpicker,
    FormNumber
  },
  props: {
    modelValue: Object
  },
  computed: {
    result: {
      get() {
        return this.modelValue
      },
      set(val) {
        this.$emit('update:modelValue', val)
      }
    }
  },
  data: () => ({
    loaded: false,
    extended: false,
    border: {
      size: null,
      color: null
    },
    border_top: {
      size: null,
      color: null
    },
    border_bottom: {
      size: null,
      color: null
    },
    border_left: {
      size: null,
      color: null
    },
    border_right: {
      size: null,
      color: null
    }
  }),
  watch: {
    extended(val) {
      if (!this.loaded) return

      this.result.border = undefined
      this.result.borderTop = undefined
      this.result.borderBottom = undefined
      this.result.borderLeft = undefined
      this.result.borderRight = undefined

      if (val) {
        this.propSetter('border', null)
      } else {
        this.propSetter('borderTop', null)
        this.propSetter('borderBottom', null)
        this.propSetter('borderLeft', null)
        this.propSetter('borderRight', null)
      }
    },
    border: {
      deep: true,
      handler({ size, color }) {
        if (!size) {
          this.result.border = undefined
        } else {
          this.result.border = `${size}px solid ${color || 'transparent'}`
        }
      }
    },
    border_top: {
      deep: true,
      handler({ size, color }) {
        if (!size) {
          this.result.borderTop = undefined
        } else {
          this.result.borderTop = `${size}px solid ${color || 'transparent'}`
        }
      }
    },
    border_bottom: {
      deep: true,
      handler({ size, color }) {
        if (!size) {
          this.result.borderBottom = undefined
        } else {
          this.result.borderBottom = `${size}px solid ${color || 'transparent'}`
        }
      }
    },
    border_left: {
      deep: true,
      handler({ size, color }) {
        if (!size) {
          this.result.borderLeft = undefined
        } else {
          this.result.borderLeft = `${size}px solid ${color || 'transparent'}`
        }
      }
    },
    border_right: {
      deep: true,
      handler({ size, color }) {
        if (!size) {
          this.result.borderRight = undefined
        } else {
          this.result.borderRight = `${size}px solid ${color || 'transparent'}`
        }
      }
    }
  },
  mounted() {
    if (this.modelValue) {
      const changes = new Promise((resolve) => {
        if (
          this.modelValue.borderTop ||
          this.modelValue.borderBottom ||
          this.modelValue.borderLeft ||
          this.modelValue.borderRight
        ) {
          this.extended = true
        }

        Object.keys(this.modelValue).forEach((key, index, array) => {
          this.propSetter(key, this.modelValue[key])
          if (index === array.length - 1) resolve()
        })
      })

      changes.then(() => {
        this.loaded = true
      })
    }
  },
  methods: {
    propSetter(prop, value) {
      const props = {
        border: 'border',
        borderTop: 'border_top',
        borderBottom: 'border_bottom',
        borderLeft: 'border_left',
        borderRight: 'border_right'
      }

      if (this[props[prop]]) {
        if (!value) {
          this[props[prop]].size = null
          this[props[prop]].color = null
        } else {
          // eslint-disable-next-line no-unused-vars
          const [size, type, color] = value.split(' ')
          this[props[prop]].size = parseFloat(size.slice(-2) === 'px' ? size.slice(0, -2) : size)
          this[props[prop]].color = color !== 'transparent' ? color : null
        }
      }
    }
  }
}
</script>

<style></style>
