<template>
  <div class="html-editor" :class="`format-${format}`">
    <Preview
      v-model="result"
      @addRow="addRow"
      @removeRow="removeRow"
      @openRowProps="openRowProps"
      @openElementProps="openElementProps"
      @saveRow="saveRow"
      @removeElement="removeElement"
      :isMobile="isMobile"
      :format="format"
    />
    <Tools
      :templates="templates"
      @deleteTemplate="$emit('deleteTemplate', $event)"
      @onChangePreviewSize="onChangePreviewSize"
      :isMobile="isMobile"
      ref="tools"
    />
    <Props
      v-model="result[selectedRowIndex]"
      :selectedColIndex="selectedColIndex"
      @close="closeProps"
      v-if="result[selectedRowIndex]"
    />
    <PropsContent
      v-model="selectedElement"
      @close="closeProps"
      v-if="selectedElement"
      :autocompletes="autocompletes"
    />
  </div>
</template>

<script>
import Preview from './components/Preview.vue'
import Tools from './components/Tools.vue'
import Props from './components/Props.vue'
import PropsContent from './components/PropsContent.vue'
import { defaultRow, keyGen } from './composables'

export default {
  components: {
    Preview,
    Tools,
    Props,
    PropsContent
  },
  emits: ['update:modelValue', 'saveTemplate', 'deleteTemplate'],
  props: {
    modelValue: {
      type: Array,
      default: () => []
    },
    templates: {
      type: Array,
      default: () => []
    },
    autocompletes: {
      type: Array,
      default: () => []
    },
    format: {
      type: String,
      default: 'email',
      validator: (val) => {
        const validFormats = ['email', 'web', 'A4', 'A5']

        return validFormats.includes(val)
      }
    }
  },
  data: () => ({
    selectedRowIndex: null,
    selectedColIndex: null,
    selectedElement: null,
    isMobile: false
  }),
  computed: {
    result: {
      get() {
        return [...this.modelValue]
      },
      set(val) {
        this.$emit('update:modelValue', val)
      }
    }
  },
  methods: {
    addRow({ index, before = false }) {
      const array = [...this.result]
      const item = {
        ...JSON.parse(JSON.stringify(defaultRow)),
        key: keyGen()
      }
      if (index === undefined || index >= array.length) {
        array.push(item)

        this.openRowProps(array.length - 1)
      } else {
        if (before) {
          array.splice(index, 0, item)

          this.openRowProps(index)
        } else {
          array.splice(index + 1, 0, item)

          this.openRowProps(index + 1)
        }
      }

      this.result = array
    },
    async removeRow(index) {
      await this.$confirm({
        title: 'Deleting row',
        text: 'Are you sure?'
      })

      const array = [...this.result]
      array.splice(index, 1)

      this.result = array

      this.closeProps()
    },
    async removeElement({ rowIndex, colIndex, elementIndex }) {
      await this.$confirm({
        title: 'Deleting element',
        text: 'Are you sure?'
      })

      const row = this.result[rowIndex]
      const col = row.child.child.child.children[colIndex]
      col.children.splice(elementIndex, 1)
    },
    async saveRow(row) {
      const templateName = await this.$alert.fireModal({
        title: 'Create row section',
        html: 'Please define a name for the section',
        input: 'text',
        inputPlaceholder: 'Section name'
      })

      if (templateName) {
        this.$emit('saveTemplate', {
          key: keyGen(),
          name: templateName,
          html: row
        })

        this.closeProps()
      }
    },

    // Props fns
    openElementProps(element) {
      this.closeProps()

      setTimeout(() => {
        this.selectedElement = element
      }, 100)
    },
    openRowProps(rowIndex, colIndex) {
      this.closeProps()

      setTimeout(() => {
        this.selectedRowIndex = rowIndex
        this.selectedColIndex = colIndex
      }, 100)
    },
    closeProps() {
      this.selectedRowIndex = null
      this.selectedColIndex = null
      this.selectedElement = null

      if (this.format === 'web') {
        this.$refs.tools.close()
      }
    },
    onChangePreviewSize(val) {
      this.isMobile = val === 'mobile'
    }
  }
}
</script>

<style></style>
