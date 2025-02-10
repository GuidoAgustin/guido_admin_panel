<template>
  <div class="d-flex justify-content-between align-items-center">
    <h6 class="label">Margin</h6>
    <FormSwitch label="More options" flex-field small v-model="extended" />
  </div>
  <FormNumber label="Margin All sides" flex-field v-if="!extended" v-model="margin">
    <div class="unit">px</div>
  </FormNumber>

  <template v-else>
    <FormNumber label="Margin Top" flex-field v-model="margin_top">
      <div class="unit">px</div>
    </FormNumber>
    <FormNumber label="Margin Bottom" flex-field v-model="margin_bottom">
      <div class="unit">px</div>
    </FormNumber>
    <FormNumber label="Margin Left" flex-field v-model="margin_left">
      <div class="unit">px</div>
    </FormNumber>
    <FormNumber label="Margin Right" flex-field v-model="margin_right">
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
    margin: null,
    margin_top: null,
    margin_bottom: null,
    margin_left: null,
    margin_right: null
  }),
  watch: {
    extended(val) {
      if (!this.loaded) return

      this.style.marginTop = undefined
      this.style.marginBottom = undefined
      this.style.marginLeft = undefined
      this.style.marginRight = undefined
      this.style.margin = undefined

      if (val) {
        this.propSetter('margin', null)
      } else {
        this.propSetter('marginTop', null)
        this.propSetter('marginBottom', null)
        this.propSetter('marginLeft', null)
        this.propSetter('marginRight', null)
      }
    },
    margin(size) {
      if (!size) {
        this.style.margin = undefined
      } else {
        this.style.margin = `${size}px`
      }
    },
    margin_top(size) {
      if (!size) {
        this.style.marginTop = undefined
      } else {
        this.style.marginTop = `${size}px`
      }
    },
    margin_bottom(size) {
      if (!size) {
        this.style.marginBottom = undefined
      } else {
        this.style.marginBottom = `${size}px`
      }
    },
    margin_left(size) {
      if (!size) {
        this.style.marginLeft = undefined
      } else {
        this.style.marginLeft = `${size}px`
      }
    },
    margin_right(size) {
      if (!size) {
        this.style.marginRight = undefined
      } else {
        this.style.marginRight = `${size}px`
      }
    }
  },

  mounted() {
    if (this.modelValue) {
      const changes = new Promise((resolve) => {
        if (
          this.modelValue.marginTop ||
          this.modelValue.marginLeft ||
          this.modelValue.marginBottom ||
          this.modelValue.marginRight
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
        margin: 'margin',
        marginTop: 'margin_top',
        marginBottom: 'margin_bottom',
        marginLeft: 'margin_left',
        marginRight: 'margin_right'
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
