<template>
  <div class="d-flex justify-content-between align-items-center">
    <h6 class="label">Link</h6>
  </div>

  <FormText label="Inner text" flex-field v-model="inner_text" />
  <FormText label="URL" flex-field v-model="href" />

  <FormColorpicker label="Text Color" flex-field v-model="color" />
  <FormColorpicker label="Background Color" flex-field v-model="bg_color" />

  <FormNumber label="Border radius" flex-field v-model="border_radius">
    <div class="unit">px</div>
  </FormNumber>
  <FormNumber label="Width" flex-field v-model="width">
    <div class="unit">%</div>
  </FormNumber>
  <FormSelect label="Position" flex-field :options="position_options" v-model="position" />
  <FormSelect label="Text Align" flex-field :options="align_options" v-model="text_align" />
  <FormNumber label="Line height" flex-field v-model="line_height">
    <div class="unit">%</div>
  </FormNumber>
  <FormNumber label="Font Size" flex-field v-model="font_size">
    <div class="unit">px</div>
  </FormNumber>
  <FormSelect label="Font weight" flex-field :options="weight_options" v-model="font_weight" />
  <FormSelect label="Font style" flex-field :options="style_options" v-model="font_style" />
</template>

<script>
import FormColorpicker from '@/components/Form/FormColorpicker.vue'
import FormText from '@/components/Form/FormText.vue'
import FormNumber from '@/components/Form/FormNumber.vue'
import FormSelect from '@/components/Form/FormSelect.vue'

export default {
  components: { FormColorpicker, FormText, FormSelect, FormNumber },
  props: { modelValue: { type: Object } },
  emits: ['update:modelValue'],
  data: () => ({
    align_options: ['left', 'center', 'right', 'justify'],
    weight_options: [
      { value: 400, label: 'Normal' },
      { value: 600, label: 'Bold' },
      { value: 800, label: 'Bolder' }
    ],
    style_options: ['normal', 'italic', 'oblique'],
    position_options: ['left', 'center', 'right'],

    inner_text: null,
    href: '#',
    color: null,
    bg_color: null,
    width: 100,
    text_align: 'left',
    position: 'left',
    line_height: 110,
    border_radius: 8,
    font_size: 16,
    font_weight: null,
    font_style: 'normal'
  }),
  watch: {
    // Button container styles
    position(val) {
      if (!val) {
        this.result.style.textAlign = undefined
      } else {
        this.result.style.textAlign = val
      }
    },

    // Button Attributes
    inner_text(val) {
      this.result.child.inner_text = val
    },
    href(val) {
      this.result.child.href = val
    },

    // Button Styles
    color(val) {
      if (!val) {
        this.result.child.style.color = undefined
      } else {
        this.result.child.style.color = val
      }
    },
    bg_color(val) {
      if (!val) {
        this.result.child.style.backgroundColor = undefined
      } else {
        this.result.child.style.backgroundColor = val
      }
    },
    width(val) {
      if (!val) {
        this.result.child.style.width = undefined
      } else {
        this.result.child.style.width = `${val}%`
      }
    },
    text_align(val) {
      if (!val) {
        this.result.child.style.textAlign = undefined
      } else {
        this.result.child.style.textAlign = val
      }
    },
    line_height(val) {
      if (!val) {
        this.result.child.style.lineHeight = undefined
      } else {
        this.result.child.style.lineHeight = `${val}%`
      }
    },
    font_size(val) {
      if (!val) {
        this.result.child.style.fontSize = undefined
      } else {
        this.result.child.style.fontSize = `${val}px`
      }
    },
    border_radius(val) {
      if (!val) {
        this.result.child.style.borderRadius = undefined
      } else {
        this.result.child.style.borderRadius = `${val}px`
      }
    },
    font_weight(val) {
      if (!val) {
        this.result.child.style.fontWeight = undefined
      } else {
        this.result.child.style.fontWeight = val
      }
    },
    font_style(val) {
      if (!val) {
        this.result.child.style.fontStyle = undefined
      } else {
        this.result.child.style.fontStyle = val
      }
    }
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
  mounted() {
    if (this.modelValue) {
      Object.keys(this.modelValue).forEach((key) => {
        if (key === 'child') {
          Object.keys(this.modelValue[key]).forEach((childKey) => {
            if (childKey === 'innerText') {
              this.inner_text = this.modelValue[key][childKey]
            } else if (childKey === 'href') {
              this.href = this.modelValue[key][childKey]
            } else if (childKey === 'style') {
              Object.keys(this.modelValue[key][childKey]).forEach((prop) => {
                this.propSetter(prop, this.modelValue[key][childKey][prop])
              })
            }
          })
        } else if (key === 'style') {
          if (this.modelValue[key].textAlign) {
            this.position = this.modelValue[key].textAlign
          }
        }
      })
    }
  },
  methods: {
    propSetter(prop, value) {
      const props = {
        color: 'color',
        backgroundColor: 'bg_color',
        width: 'width',
        textAlign: 'text_align',
        lineHeight: 'line_height',
        fontSize: 'font_size',
        fontWeight: 'font_weight',
        fontStyle: 'font_style',
        borderRadius: 'border_radius'
      }

      if (this[props[prop]] !== undefined) {
        if (!value) {
          this[props[prop]] = null
        } else if (['lineHeight', 'width'].includes(prop)) {
          this[props[prop]] = parseFloat(value.slice(0, -1))
        } else if (['fontSize', 'borderRadius'].includes(prop)) {
          this[props[prop]] = parseFloat(value.slice(0, -2))
        } else {
          this[props[prop]] = value
        }
      }
    }
  }
}
</script>
