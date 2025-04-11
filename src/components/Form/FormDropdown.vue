<template>
  <slot name="action" :open="openDropdown" :close="closeDropdown">
    <button class="btn btn-primary" @click="openDropdown">Open dropdown</button>
  </slot>
  <template v-if="ready && !disabled">
    <Teleport :to="container" v-if="!keepOpen">
      <div
        class="form-dropdown"
        :style="dropdownStyle"
        ref="dropdown"
        v-if="dropdownOpen"
        @click="closeDropdown(200)"
        :class="{ keepOpen }"
        v-bind="$attrs"
      >
        <div class="form-dropdown-header" v-if="$slots.header">
          <slot name="header" />
        </div>
        <slot :open="openDropdown" :close="closeDropdown"></slot>
      </div>
    </Teleport>

    <div class="form-dropdown" ref="dropdown" v-else>
      <slot :open="openDropdown" :close="closeDropdown"></slot>
    </div>
  </template>
</template>

<script>
export default {
  inheritAttrs: false,
  props: {
    position: {
      type: String,
      default: 'bottom',
      validator(value) {
        return ['top', 'bottom', 'left', 'right'].includes(value)
      }
    },
    parentEl: [String, HTMLElement],
    keepOpen: Boolean,
    disabled: Boolean
  },
  data() {
    return {
      ready: false,
      dropdownOpen: false,
      dropdownStyle: {},
      clickOutsideListenerAdded: false
    }
  },
  mounted() {
    setTimeout(() => {
      this.ready = true

      if (this.keepOpen) this.dropdownOpen = true
    }, 100)
  },
  computed: {
    container() {
      return this.getContainer()
    }
  },
  methods: {
    getClosestScrollableElement(element) {
      while (element) {
        const style = window.getComputedStyle(element)
        if (
          style.overflow === 'auto' ||
          style.overflow === 'scroll' ||
          style.overflowY === 'auto' ||
          style.overflowY === 'scroll'
        ) {
          return element
        }
        element = element.parentElement
      }
      return document.body
    },
    getParent() {
      if (!this.parentEl) {
        return this.$el.parentNode
      }

      if (typeof this.parentEl === 'string') {
        return document.querySelector(this.parentEl)
      }

      return this.parentEl
    },
    getContainer() {
      let element = this.$el.parentNode

      return this.getClosestScrollableElement(element)
    },
    positionDropdown(position = 'bottom', minWidth = 200) {
      const parentElem = this.getParent()
      const containerElem = this.getContainer()
      const dropdownEl = this.$refs.dropdown
      const parentRect = parentElem.getBoundingClientRect()
      const containerRect = containerElem.getBoundingClientRect()

      if (!dropdownEl) return

      const offsetTop = parentRect.top - containerRect.top + containerElem.scrollTop
      const offsetLeft = parentRect.left - containerRect.left
      const parentWidth = parentRect.width
      const dropdownHeight = dropdownEl.offsetHeight
      const dropdownWidth = parentWidth < minWidth ? minWidth : parentWidth
      let top, left

      switch (position) {
        case 'top':
          top = offsetTop - dropdownHeight
          left = offsetLeft

          // Check if too close to the top edge
          if (top - containerElem.scrollTop < 0) {
            top = offsetTop + parentElem.offsetHeight
          }
          // Set left regarding minWidth
          if (parentWidth < minWidth) {
            left = offsetLeft - (minWidth - parentWidth)
          }
          // Check if too close to the left edge
          if (left < 0) {
            left = offsetLeft + parentElem.offsetWidth
          }
          break
        case 'left':
          top = offsetTop
          left = offsetLeft - parentWidth

          // Check if too close to the left edge
          if (left < 0) {
            left = offsetLeft + parentElem.offsetWidth
          }
          if (parentWidth < minWidth) {
            left = left - (minWidth - parentWidth)
          }
          break
        case 'right':
          {
            top = offsetTop
            left = offsetLeft + parentElem.offsetWidth

            // Check if too close to the right edge
            if (left + dropdownWidth > containerElem.offsetWidth) {
              left = offsetLeft - dropdownWidth
            }
          }
          break
        case 'bottom':
        default: {
          top = offsetTop + parentElem.offsetHeight
          left = offsetLeft

          const dropdownBottom = top + dropdownHeight
          const scrollOffsetBottom = containerElem.offsetHeight + containerElem.scrollTop

          // Check if too close to the bottom edge (default is bottom)
          if (dropdownBottom > scrollOffsetBottom) {
            top = offsetTop - dropdownHeight
          }

          // Set left regarding minWidth
          if (parentWidth < minWidth) {
            left = offsetLeft - (minWidth - parentWidth)
          }
          // Check if too close to the left edge
          if (left < 0) {
            left = offsetLeft + parentElem.offsetWidth
          }
        }
      }

      if (parentWidth < minWidth) {
        return { top, left, width: minWidth }
      }

      return { top, left, width: parentWidth }
    },
    updatePosition() {
      const { top, left, width } = this.positionDropdown(this.position)

      const style = {}

      if (top !== undefined) style.top = `${top}px`
      if (left !== undefined) style.left = `${left}px`
      if (width !== undefined) style.width = `${width}px`

      this.dropdownStyle = style
    },
    closeDropdown(timeout = 0) {
      setTimeout(() => {
        this.dropdownOpen = false
        this.removeClickOutsideEvent()
      }, timeout)
    },
    openDropdown() {
      if (this.disabled) return

      this.dropdownOpen = true
      this.$nextTick(() => {
        this.addClickOutsideEvent()
        this.updatePosition()
      })
    },
    clickOutside(e) {
      const dropdown = this.$refs.dropdown

      if (!dropdown?.contains(e.target)) {
        this.closeDropdown()
      }
    },
    addClickOutsideEvent() {
      if (this.clickOutsideListenerAdded) return

      setTimeout(() => {
        this.clickOutsideListenerAdded = true
        window.addEventListener('click', this.clickOutside)
      }, 500)
    },
    removeClickOutsideEvent() {
      this.clickOutsideListenerAdded = false
      window.removeEventListener('click', this.clickOutside)
    }
  }
}
</script>
