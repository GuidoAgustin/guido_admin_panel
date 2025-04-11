<template>
  <div
    class="form-container form-combobox"
    :class="{
      disabled,
      'flex-field': flexField,
      'keep-open': keepOpen,
      'form-combobox-multiple': multiple
    }"
  >
    <label v-if="label">{{ label }}</label>

    <FormDropdown ref="formDropdown" :parentEl="`#form_wrapper_${itemId}`" :keepOpen="keepOpen">
      <template #action="{ open, close }">
        <div class="form-wrapper" :id="`form_wrapper_${itemId}`">
          <div class="icon" v-if="icon">
            <i :class="icon"></i>
          </div>
          <input
            type="text"
            v-model="search"
            :id="itemId"
            @click.stop="openDropdown(open)"
            @focus="onFocusInput(open)"
            @blur="closeDropdown(close)"
            @input="onSearch"
            @keydown.up="onArrowUp"
            @keydown.down="onArrowDown"
            @keydown.enter="onEnter(open, close)"
            ref="input"
            autocomplete="new-combobox"
            :placeholder="placeholder"
          />
          <div class="loader" v-if="isLoading">
            <slot name="loader">
              <div class="spinner"></div>
            </slot>
          </div>

          <slot />
        </div>

        <div class="options-result" v-if="multiple">
          <div
            class="select-result-item"
            v-for="(opt, ix) of value"
            :key="opt[this.optionValue] || opt"
          >
            {{ opt[this.optionLabel] || opt }}
            <i class="fa fa-times" @click.stop="removeOption(ix)"></i>
          </div>
        </div>
      </template>

      <template #default="{ close }">
        <ul ref="dropdown">
          <li
            v-for="(option, index) in options"
            :key="option[this.optionValue]"
            :class="{ highlighted: index === highlightedIndex }"
            @mousedown.prevent="selectOption(option, close)"
            ref="options"
          >
            {{ option[this.optionLabel] }}
          </li>
          <li v-if="!options.length">{{ noDataMsg }}</li>
        </ul>
      </template>
    </FormDropdown>
  </div>
</template>

<script>
import debounce from '@/utils/debounce.js'
import FormDropdown from './FormDropdown.vue'

export default {
  components: {
    FormDropdown
  },
  emits: ['onSelectOption', 'onFocus'],
  props: {
    value: {
      type: [Array, Object],
      default: null
    },
    label: {
      type: String
    },
    placeholder: {
      type: String
    },
    icon: {
      type: String,
      default: null
    },
    multiple: {
      type: Boolean,
      default: false
    },
    disabled: {
      type: Boolean,
      default: false
    },
    minLen: {
      type: Number,
      default: 3
    },
    noDataMsg: {
      type: String,
      default: 'No entries were found'
    },
    options: {
      type: Array,
      default: () => []
    },
    optionGetter: {
      type: Function,
      default: () => ({})
    },
    optionLabel: {
      type: String,
      default: 'label'
    },
    optionValue: {
      type: String,
      default: 'value'
    },
    flexField: {
      type: Boolean,
      default: false
    },
    keepOpen: {
      type: Boolean,
      default: false
    },
    newOption: {
      type: String,
      default: null
    }
  },
  data() {
    return {
      itemId: null,
      search: '',
      dropdownOpen: false,
      highlightedIndex: -1,
      isLoading: false,
      optGetter: null,
      fullSearched: false
    }
  },
  computed: {
    parentElem() {
      return this.$refs.form_wrapper
    },
    result: {
      get() {
        return this.value
      },
      set(val) {
        this.$emit('onSelectOption', val)
      }
    }
  },
  created() {
    this.optGetter = debounce({
      callback: this.optionGetter,
      delay: 500,
      startedCallback: () => {
        this.isLoading = true
      },
      finalCallback: () => {
        this.isLoading = false
      }
    })
  },
  watch: {
    value: {
      immediate: true,
      handler(val) {
        if (!this.multiple && val?.[this.optionLabel]) {
          this.search = val[this.optionLabel]
        }

        if (!val) {
          this.search = null
        }
      }
    },
    options() {
      this.$refs.formDropdown.openDropdown()
      this.$nextTick(() => {
        this.$refs.formDropdown.updatePosition()
      })
    }
  },
  mounted() {
    this.itemId = Math.floor(Math.random() * Date.now())

    if (this.keepOpen) {
      this.fullSearch()
    }
  },
  beforeUnmount() {
    this.optGetter.cancel && this.optGetter.cancel()
  },
  methods: {
    fullSearch() {
      if (this.fullSearched) return

      this.fullSearched = true
      this.optGetter(null)
    },
    onFocusInput(open) {
      this.$emit('onFocus')
      this.openDropdown(open)
    },
    openDropdown(openEvt) {
      if (this.dropdownOpen) return

      openEvt()
      this.dropdownOpen = true
      this.fullSearch()
    },
    closeDropdown(closeEvt) {
      setTimeout(() => {
        closeEvt()
        this.dropdownOpen = this.keepOpen ? true : false
        this.highlightedIndex = -1
      }, 100) // Small delay to allow click event to register
    },
    selectOption(option, closeEvt) {
      this.closeDropdown(closeEvt)

      if (this.multiple) {
        this.search = null

        if (option[this.optionValue] === 'new') {
          this.result.push({
            ...option,
            [this.optionLabel]: option[this.optionLabel].slice(this.newOption.length)
          })
        } else {
          this.result.push(option)
        }
      } else {
        this.search = option[this.optionLabel]
        this.result = option
      }
    },
    removeOption(index) {
      this.result.splice(index, 1)
    },
    onSearch() {
      if (!this.search || this.search === '') {
        this.search = null
        this.fullSearch()
      } else if (this.search.length >= this.minLen) {
        this.fullSearched = false
        this.optGetter(this.search)
      }
    },

    // Keyboard events
    onArrowDown() {
      if (!this.dropdownOpen) return

      if (this.highlightedIndex < this.options.length - 1) {
        this.highlightedIndex++
        this.scrollIntoView()
      }
    },
    onArrowUp() {
      if (!this.dropdownOpen) return

      if (this.highlightedIndex > 0) {
        this.highlightedIndex--
        this.scrollIntoView()
      }
    },
    onEnter(openEvt, closeEvt) {
      if (!this.dropdownOpen) {
        this.openDropdown(openEvt)
        return
      }

      if (this.highlightedIndex >= 0 && this.highlightedIndex < this.options.length) {
        this.selectOption(this.options[this.highlightedIndex], closeEvt)
      }
    },
    scrollIntoView() {
      this.$nextTick(() => {
        const options = this.$refs.options
        const highlightedOption = options[this.highlightedIndex]

        if (highlightedOption) {
          const dropdown = this.$refs.dropdown
          const optionTop = highlightedOption.offsetTop
          const optionBottom = optionTop + highlightedOption.offsetHeight
          const dropdownScrollTop = dropdown.scrollTop
          const dropdownHeight = dropdown.offsetHeight

          if (optionTop < dropdownScrollTop) {
            dropdown.scrollTop = optionTop
          } else if (optionBottom > dropdownScrollTop + dropdownHeight) {
            dropdown.scrollTop = optionBottom - dropdownHeight
          }
        }
      })
    }
  }
}
</script>
