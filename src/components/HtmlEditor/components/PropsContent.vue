<template>
  <div class="he-sidemenu he-props" :class="{ open }">
    <div class="he-close" @click="close">
      <span class="material-symbols-outlined">double_arrow</span>
    </div>
    <div class="he-title">
      <h6>
        Content properties <small>({{ elementType }})</small>
      </h6>
    </div>
    <div class="he-wrapper" :style="`padding: 0.75em;`">
      <LinkProps v-model="element" :key="`link_${element.key}`" v-if="propAvailable('link')" />
      <HtmlProps v-model="element" :key="`html_${element.key}`" v-if="propAvailable('html')" />
      <ImageProps v-model="element" :key="`img_${element.key}`" v-if="propAvailable('image')" />
      <TextProps
        v-model="element"
        :key="`txt_${element.key}`"
        v-if="propAvailable('text')"
        :autocompletes="autocompletes"
      />
      <MarginProps
        v-model="element.style"
        :key="`mg_${element.key}`"
        v-if="propAvailable('margin')"
      />
      <template v-if="propAvailable('padding')">
        <PaddingProps
          v-model="element.child.style"
          :key="`pdchild_${element.key}`"
          v-if="element.child"
        />
        <PaddingProps v-model="element.style" :key="`pd_${element.key}`" v-else />
      </template>

      <LicensorProps
        v-model="element"
        :key="`licensor_${element.key}`"
        v-if="propAvailable('licensor')"
      />
      <LicenseeProps
        v-model="element"
        :key="`licensee_${element.key}`"
        v-if="propAvailable('licensee')"
      />
      <PaymentsProps
        v-model="element"
        :key="`payments_${element.key}`"
        v-if="propAvailable('payments')"
      />
    </div>
  </div>
</template>

<script>
import LinkProps from '../Properties/LinkProps.vue'
import ImageProps from '../Properties/ImageProps.vue'
import TextProps from '../Properties/TextProps.vue'
import MarginProps from '../Properties/MarginProps.vue'
import PaddingProps from '../Properties/PaddingProps.vue'
import HtmlProps from '../Properties/HtmlProps.vue'
import LicensorProps from '../Properties/LicensorProps.vue'
import LicenseeProps from '../Properties/LicenseeProps.vue'
import PaymentsProps from '../Properties/PaymentsProps.vue'

export default {
  components: {
    LinkProps,
    ImageProps,
    TextProps,
    MarginProps,
    PaddingProps,
    HtmlProps,
    LicensorProps,
    LicenseeProps,
    PaymentsProps
  },
  emits: ['close'],
  props: {
    modelValue: {
      type: Object,
      defaultValue: () => ({ style: {} })
    },
    autocompletes: {
      type: Array,
      default: () => []
    }
  },
  data: () => ({
    open: false,
    propsForElem: {
      button: ['link', 'margin', 'padding'],
      text: ['text', 'margin'],
      heading: ['text', 'margin'],
      img: ['image', 'margin'],
      divider: ['margin'],
      html: ['html'],
      licensor: ['licensor'],
      licensee: ['licensee'],
      payments: ['payments']
    }
  }),
  computed: {
    element: {
      get() {
        return this.modelValue
      },
      set(val) {
        this.$emit('update:modelValue', val)
      }
    },
    elementType() {
      return this.element.class.split('-').pop()
    }
  },
  mounted() {
    setTimeout(() => {
      this.open = true
    }, 10)
  },
  methods: {
    close() {
      this.open = false
      setTimeout(() => {
        this.$emit('close')
      }, 250)
    },
    propAvailable(propType) {
      const props = this.propsForElem[this.elementType]

      return props?.includes(propType) || false
    }
  }
}
</script>

<style></style>
