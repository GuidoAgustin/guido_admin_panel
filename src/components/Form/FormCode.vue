<template>
  <div class="form-container form-code" :class="{ disabled }">
    <label v-if="label">{{ label }}</label>
    <div class="form-wrapper" v-if="ready">
      <vue-monaco-editor
        v-model:value="resultHtml"
        language="html"
        theme="vs"
        :options="opts"
        @mount="handleMount"
      />
    </div>
  </div>
</template>

<script>
import { VueMonacoEditor } from '@guolao/vue-monaco-editor'

export default {
  components: { VueMonacoEditor },
  props: {
    modelValue: {
      type: String,
      default: null
    },
    disabled: {
      type: Boolean,
      default: false
    },
    label: {
      type: String,
      default: null
    }
  },
  data: () => ({
    ready: false,
    editor: null,
    opts: {
      automaticLayout: true,
      formatOnType: true,
      formatOnPaste: true,
      autoIndent: 'full',
      fontSize: '12px',
      minimap: {
        enabled: false
      }
    }
  }),
  computed: {
    resultHtml: {
      get() {
        return this.modelValue
      },
      set(val) {
        this.$emit('update:modelValue', val)
      }
    }
  },
  mounted() {
    setTimeout(() => {
      this.ready = true
    }, 100)
  },
  methods: {
    handleMount(editorInstance) {
      this.editor = editorInstance
    },

    formatCode() {
      this.editor?.getAction('editor.action.formatDocument').run()
    }
  }
}
</script>

<style scoped></style>
