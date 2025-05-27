<template>
  <div :class="{ disabled }">
    <slot :launchPicker="launchFilePicker">
      <div
        class="form-container form-uploader"
        :class="{ 'flex-field': flexField }"
        v-bind="$attrs"
      >
        <label v-if="label">{{ label }}</label>

        <div class="form-wrapper">
          <div class="d-flex gap-2">
            <slot name="current" />
            <button type="button" class="btn btn-primary btn-sm btn-block" @click="launchFilePicker">
              {{ buttonText }}
            </button>
          </div>

          <div>
            <small v-if="file">
              {{ file.name }} ({{ (file.size / 1024).toFixed(2) }}kb)
              <i class="fa fa-times ml-2 pointer" @click="resetInput"></i>
            </small>
          </div>
        </div>
      </div>
    </slot>
    <input type="file" @change="fileSelected" ref="fileInput" :multiple="multiple" />
  </div>
</template>

<script>
export default {
  emtis: ['onChange', 'onReset'], // Typo original: emtis
  props: {
    modelValue: {
      type: [Object, File, String],
      default: () => ({})
    },
    label: {
      type: String
    },
    buttonText: {
      type: String,
      default: 'Upload File'
    },
    maxSizeMB: {
      type: Number,
      default() {
        return 2 // 2 MB
      }
    },
    pdfType: {
      type: Boolean,
      default: false
    },
    imageType: {
      type: Boolean,
      default: false
    },
    videoType: {
      type: Boolean,
      default: false
    },
    xlsType: {
      type: Boolean,
      default: false
    },
    disabled: {
      type: Boolean,
      default: false
    },
    flexField: {
      type: Boolean,
      default: false
    },
    resetOnSelect: {
      type: Boolean,
      default: false
    },
    tooBigErrorMsg: {
      type: String,
      default: 'The file must be less than {maxSize}MB'
    },
    multiple: Boolean
  },
  data: () => ({ // Mantenido como arrow function
    file: null
  }),
  computed: {
    tooBigMsg() {
      if (this.tooBigErrorMsg.includes('{maxSize}')) {
        return this.tooBigErrorMsg.replace('{maxSize}', this.maxSizeMB.toFixed(2))
      }
      return this.tooBigErrorMsg
    },
    acceptedTypes() {
      if (!this.imageType && !this.pdfType && !this.videoType && !this.xlsType) {
        return [
          {
            accepted: true,
            mime: 'image.*',
            error: 'an Image'
          },
          {
            accepted: true,
            mime: 'application/pdf',
            error: 'a PDF'
          },
          {
            accepted: true,
            mime: 'video.*',
            error: 'a Video'
          },
          {
            accepted: true,
            mime: 'sheet',
            error: 'a XLS'
          }
        ]
      }

      let types = []

      if (this.imageType) {
        types.push({
          accepted: true,
          mime: 'image.*',
          error: 'an Image'
        })
      }

      if (this.pdfType) {
        types.push({
          accepted: true,
          mime: 'application/pdf',
          error: 'a PDF'
        })
      }

      if (this.videoType) {
        types.push({
          accepted: true,
          mime: 'video.*',
          error: 'a Video'
        })
      }

      if (this.xlsType) {
        types.push({
          accepted: true,
          mime: 'sheet',
          error: 'a XLS'
        })
      }

      return types
    }
  },
  methods: {
    launchFilePicker() {
      if (this.disabled) return
      this.$refs.fileInput.click()
    },
    resetInput() {
      this.$refs.fileInput.value = null
      this.file = null
      this.$emit('update:modelValue', null) // Asumo que este v-model quiere null al resetear
      this.$emit('onReset')
    },
    getBlobUrl(file) {
      return URL.createObjectURL(file)
    },
    getBase64Url(file) {
      return new Promise((resolve) => {
        const reader = new FileReader()

        reader.onload = function () {
          const base64String = reader.result
          resolve(base64String)
        }

        reader.readAsDataURL(file)
      })
    },
    async fileSelected(evt) {
      if (!evt.target.files.length) return

      if (this.multiple) {
        const result = []

        for (const file of evt.target.files) {
          if (!this.checkFileType(file.type)) return
          if (!this.checkFileSize(file.size)) return

          result.push({
            file,
            url: this.getBlobUrl(file),
            base64: await this.getBase64Url(file)
          })
        }
        // Para v-model con multiple, deberías emitir un array de Files
        this.$emit('update:modelValue', result.map(r => r.file)); 
        this.$emit('onChange', result)
      } else {
        this.file = evt.target.files[0]
        // Check file type
        if (!this.checkFileType(this.file.type)) return

        // check whether the size is greater than the size limit
        if (!this.checkFileSize(this.file.size)) return

        this.$emit('update:modelValue', this.file) // Emitir el objeto File para v-model
        this.$emit('onChange', {
          file: this.file,
          url: this.getBlobUrl(this.file),
          base64: await this.getBase64Url(this.file)
        })
      }

      if (this.resetOnSelect) {
        // Para evitar problemas con la re-selección del mismo archivo si resetOnSelect es true.
        // O si el usuario cancela y luego quiere seleccionar el mismo.
         this.$refs.fileInput.value = null;
      } else if (this.$refs.fileInput) {
         // Siempre es bueno resetear el value del input para permitir seleccionar el mismo archivo de nuevo.
         this.$refs.fileInput.value = null;
      }
    },
    checkFileType(type) {
      let valid = false
      let errors = []

      for (const acceptedType of this.acceptedTypes) {
        if (!type.match(acceptedType.mime)) {
          errors.push(acceptedType.error)
        } else {
          valid = true
          break; // Si uno coincide, es válido
        }
      }

      if (!valid && errors.length > 0) { // Solo mostrar error si no es válido y hay tipos definidos
        this.$toast.error(`The file is not ${errors.join(' or ')}`)
      }

      return valid
    },
    checkFileSize(fileSize) {
      const sizeMB = fileSize / (1024 * 1024)

      if (sizeMB > this.maxSizeMB) {
        this.$toast.error(this.tooBigMsg)
        return false
      }

      return true
    }
  }
}
</script>

<style scoped>
input[type="file"] { /* Mantenido para asegurar que está oculto */
  display: none;
}
/* Puedes añadir otros estilos que tenías */
</style>