import { debounce } from 'lodash-es'
import { defineComponent, h, markRaw } from 'vue'

const SAMPLE_READ_ONLY_LOCK_ID = 'Integration Sample'
const INPUT_EVENT_DEBOUNCE_WAIT = 300

export default defineComponent({
  name: 'Ckeditor',

  model: {
    prop: 'modelValue',
    event: 'update:modelValue'
  },

  props: {
    editor: {
      type: Function,
      required: true
    },
    config: {
      type: Object,
      default: () => ({})
    },
    modelValue: {
      type: String,
      default: ''
    },
    tagName: {
      type: String,
      default: 'div'
    },
    disabled: {
      type: Boolean,
      default: false
    },
    disableTwoWayDataBinding: {
      type: Boolean,
      default: false
    }
  },

  emits: ['ready', 'destroy', 'blur', 'focus', 'input', 'update:modelValue'],

  data() {
    return {
      instance: null,
      lastEditorData: null
    }
  },

  watch: {
    modelValue(value) {
      if (this.instance && value !== this.lastEditorData) {
        this.instance.data.set(value)
      }
    },

    disabled(readOnlyMode) {
      if (readOnlyMode) {
        this.instance.enableReadOnlyMode(SAMPLE_READ_ONLY_LOCK_ID)
      } else {
        this.instance.disableReadOnlyMode(SAMPLE_READ_ONLY_LOCK_ID)
      }
    }
  },

  created() {
    const { CKEDITOR_VERSION } = window

    if (!CKEDITOR_VERSION) {
      return console.warn('Cannot find the "CKEDITOR_VERSION" in the "window" scope.')
    }

    const [major] = CKEDITOR_VERSION.split('.').map(Number)

    if (major >= 42 || CKEDITOR_VERSION.startsWith('0.0.0')) {
      return
    }

    console.warn(
      'The <CKEditor> component requires using CKEditor 5 in version 42+ or nightly build.'
    )
  },

  mounted() {
    const editorConfig = Object.assign({}, this.config)

    if (this.modelValue) {
      editorConfig.initialData = this.modelValue
    }

    this.editor
      .create(this.$el, editorConfig)
      .then((editor) => {
        this.instance = markRaw(editor)

        this.setUpEditorEvents()

        if (this.modelValue !== editorConfig.initialData) {
          editor.data.set(this.modelValue)
        }

        if (this.disabled) {
          editor.enableReadOnlyMode(SAMPLE_READ_ONLY_LOCK_ID)
        }

        this.$emit('ready', editor)
      })
      .catch((error) => {
        console.error(error)
      })
  },

  beforeUnmount() {
    if (this.instance) {
      this.instance.destroy()
      this.instance = null
    }

    this.$emit('destroy', this.instance)
  },

  methods: {
    setUpEditorEvents() {
      const editor = this.instance

      const emitDebouncedInputEvent = debounce(
        (evt) => {
          if (this.disableTwoWayDataBinding) {
            return
          }

          const data = (this.lastEditorData = editor.data.get())

          this.$emit('update:modelValue', data, evt, editor)
          this.$emit('input', data, evt, editor)
        },
        INPUT_EVENT_DEBOUNCE_WAIT,
        { leading: true }
      )

      editor.model.document.on('change:data', emitDebouncedInputEvent)

      editor.editing.view.document.on('focus', (evt) => {
        this.$emit('focus', evt, editor)
      })

      editor.editing.view.document.on('blur', (evt) => {
        this.$emit('blur', evt, editor)
      })
    }
  },

  render() {
    return h(this.tagName)
  }
})
