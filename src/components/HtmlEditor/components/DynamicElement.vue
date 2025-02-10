<template>
  <component
    :is="element.tag"
    :class="element.class"
    :style="elemStyles"
    v-html="element.innerHtml"
    v-if="element.innerHtml"
  />
  <component
    :is="element.tag"
    :class="element.class"
    :style="elemStyles"
    v-text="element.innerText"
    v-else-if="element.innerText"
  />
  <component :is="element.tag" :class="element.class" :style="elemStyles" v-else-if="element.child">
    <DynamicElement :element="element.child" />
  </component>
  <component
    :is="element.tag"
    :class="element.class"
    :style="elemStyles"
    v-else-if="element.children"
  >
    <DynamicElement :element="child" v-for="(child, ci) of element.children" :key="ci" />
  </component>
  <component
    :is="element.tag"
    :class="element.class"
    :style="elemStyles"
    :src="element.src"
    :width="element.width"
    :height="element.height"
    v-else-if="element.src"
  />
  <component :is="element.tag" :class="element.class" :style="elemStyles" v-else />
</template>

<script>
export default {
  props: {
    element: Object
  },
  computed: {
    elemStyles() {
      if (!this.element.style) return {}

      if (typeof this.element.style === 'string') {
        return this.element.style
      }

      return Object.fromEntries(
        // eslint-disable-next-line no-unused-vars
        Object.entries(this.element.style).filter(([_, value]) => value !== undefined)
      )
    }
  }
}
</script>

<style></style>
