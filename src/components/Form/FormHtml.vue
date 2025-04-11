<template>
  <div class="form-container form-html" :class="{ disabled }">
    <label v-if="label">
      {{ label }}
      <small class="text-muted"> Use ctrl+enter to create small line breaks </small>
    </label>
    <div class="form-wrapper">
      <ckeditor
        :editor="editor"
        v-model="result"
        :config="editorConfig"
        @ready="editorRef = $event"
      ></ckeditor>
    </div>
  </div>
</template>

<script>
import {
  ClassicEditor,
  Bold,
  Essentials,
  Italic,
  Alignment,
  Paragraph,
  Mention,
  Undo,
  FontFamily,
  FontSize,
  FontColor
} from 'ckeditor5'
import 'ckeditor5/ckeditor5.css'
import ckeditor from '@/plugins/CKeditor'

export default {
  components: {
    ckeditor
  },
  props: {
    modelValue: {
      type: String,
      default: ''
    },
    label: String,
    disabled: {
      type: Boolean,
      default: false
    },
    autocompleteOpts: Array,
    placeholder: String
  },
  data: () => ({
    editor: ClassicEditor,
    editorRef: null
  }),
  computed: {
    editorConfig() {
      return {
        plugins: [
          Bold,
          Essentials,
          Italic,
          Alignment,
          Paragraph,
          Undo,
          FontFamily,
          FontSize,
          Mention,
          FontColor
        ],
        toolbar: [
          'undo',
          'redo',
          '|',
          'alignment',
          '|',
          'bold',
          'italic',
          'fontfamily',
          'fontsize',
          'fontColor'
        ],
        mention: !this.autocompleteOpts
          ? {}
          : {
              feeds: [
                {
                  marker: '#',
                  feed: this.autocompleteOpts.filter((x) => x.startsWith('#')),
                  minimumCharacters: 0,
                  dropdownLimit: 100
                }
              ]
            },
        placeholder: this.placeholder || {}
      }
    },
    result: {
      get() {
        return this.modelValue
      },
      set(val) {
        this.$emit('update:modelValue', val)
      }
    }
  },
  methods: {
    focus() {
      this.editorRef.focus()
    }
  }
}
</script>

<style></style>
