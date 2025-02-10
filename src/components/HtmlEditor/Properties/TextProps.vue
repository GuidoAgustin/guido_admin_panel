<template>
  <div class="d-flex justify-content-between align-items-center">
    <h6 class="label">Text</h6>
  </div>

  <div class="alert alert-secondary small text-center p-2 my-2">
    Start typing # to see dynamic values
  </div>

  <FormHtml label="Inner Text" v-model="inner_text" :autocompleteOpts="autocompletes" />
</template>

<script>
import FormHtml from '@/components/Form/FormHtml.vue'

export default {
  components: { FormHtml },
  props: {
    modelValue: { type: Object },
    autocompletes: {
      type: Array,
      default: () => []
    }
  },
  emits: ['update:modelValue'],
  data: () => ({
    inner_text: null
  }),
  watch: {
    inner_text(val) {
      this.result.children = this.htmlToObj(val).map((x) => ({
        tag: 'p',
        style: x.style,
        innerHtml: x.innerHtml
      }))
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
        if (key === 'children') {
          this.inner_text = this.modelValue[key].map((x) => `<p>${x.innerHtml}</p>`).join('')
        }
      })
    }
  },
  methods: {
    propSetter(prop, value) {
      const props = {
        color: 'color',
        textAlign: 'text_align',
        lineHeight: 'line_height',
        fontSize: 'font_size',
        fontWeight: 'font_weight',
        fontStyle: 'font_style',
        fontFamily: 'font_family'
      }

      if (this[props[prop]] !== undefined) {
        if (!value) {
          this[props[prop]] = null
        } else if (prop === 'lineHeight') {
          this[props[prop]] = value.slice(0, -1)
        } else if (prop === 'fontSize') {
          this[props[prop]] = value.slice(0, -2)
        } else {
          this[props[prop]] = value
        }
      }
    },
    htmlToObj(htmlString) {
      // Create a temporary div to hold the HTML content
      let tempDiv = document.createElement('div')
      tempDiv.innerHTML = htmlString

      // Get all paragraph elements
      let paragraphs = tempDiv.getElementsByTagName('p')

      // Extract innerHTML from each paragraph
      let paragraphAttrs = []
      for (let i = 0; i < paragraphs.length; i++) {
        paragraphAttrs.push({
          innerHtml: paragraphs[i].innerHTML,
          style: paragraphs[i].getAttribute('style') || ''
        })
      }

      return paragraphAttrs
    }
  }
}
</script>
