<template>
  <div class="d-flex justify-content-between align-items-center">
    <h6 class="label">Padding</h6>
    <FormSwitch label="More options" flex-field small v-model="extended" />
  </div>
  <FormNumber label="Padding All sides" flex-field v-if="!extended" v-model="padding">
    <div class="unit">px</div>
  </FormNumber>

  <template v-else>
    <FormNumber label="Padding Top" flex-field v-model="padding_top">
      <div class="unit">px</div>
    </FormNumber>
    <FormNumber label="Padding Bottom" flex-field v-model="padding_bottom">
      <div class="unit">px</div>
    </FormNumber>
    <FormNumber label="Padding Left" flex-field v-model="padding_left">
      <div class="unit">px</div>
    </FormNumber>
    <FormNumber label="Padding Right" flex-field v-model="padding_right">
      <div class="unit">px</div>
    </FormNumber>
  </template>
</template>

<script>
import FormSwitch from '@/components/Form/FormSwitch.vue'
import FormNumber from '@/components/Form/FormNumber.vue'

export default {
  components: {
    FormSwitch,
    FormNumber
  },
  props: {
    modelValue: Object
  },
  computed: {
    style: {
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
    padding: null,
    padding_top: null,
    padding_bottom: null,
    padding_left: null,
    padding_right: null
  }),
  watch: {
    extended(val) {
      if (!this.loaded) return

      this.style.paddingTop = undefined
      this.style.paddingBottom = undefined
      this.style.paddingLeft = undefined
      this.style.paddingRight = undefined
      this.style.padding = undefined

      if (val) {
        this.propSetter('padding', null)
      } else {
        this.propSetter('paddingTop', null)
        this.propSetter('paddingBottom', null)
        this.propSetter('paddingLeft', null)
        this.propSetter('paddingRight', null)
      }
    },
    padding(size) {
      if (!size) {
        this.style.padding = undefined
      } else {
        this.style.padding = `${size}px`
      }
    },
    padding_top(size) {
      if (!size) {
        this.style.paddingTop = undefined
      } else {
        this.style.paddingTop = `${size}px`
      }
    },
    padding_bottom(size) {
      if (!size) {
        this.style.paddingBottom = undefined
      } else {
        this.style.paddingBottom = `${size}px`
      }
    },
    padding_left(size) {
      if (!size) {
        this.style.paddingLeft = undefined
      } else {
        this.style.paddingLeft = `${size}px`
      }
    },
    padding_right(size) {
      if (!size) {
        this.style.paddingRight = undefined
      } else {
        this.style.paddingRight = `${size}px`
      }
    }
  },
  mounted() {
    if (this.modelValue) {
      const changes = new Promise((resolve) => {
        if (
          this.modelValue.paddingTop ||
          this.modelValue.paddingLeft ||
          this.modelValue.paddingBottom ||
          this.modelValue.paddingRight
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
    propSetter(prop, size) {
      const props = {
        padding: 'padding',
        paddingTop: 'padding_top',
        paddingBottom: 'padding_bottom',
        paddingLeft: 'padding_left',
        paddingRight: 'padding_right'
      }

      if (this[props[prop]] !== undefined) {
        if (!size) {
          this[props[prop]] = null
        } else {
          this[props[prop]] = parseFloat(size.slice(-2) === 'px' ? size.slice(0, -2) : size)
        }
      }
    }
  }
}
</script>

<style></style>
