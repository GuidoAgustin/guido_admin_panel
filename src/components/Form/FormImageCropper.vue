<template>
  <vue-modal ref="modal" size="sm" @close="$emit('close')">
    <template #body>
      <cropper :src="image" :stencil-component="CircleStencil" @change="imageCropped" />
    </template>
    <template #footer>
      <FormButton @click="finish" small> Crop Image </FormButton>
    </template>
  </vue-modal>
</template>

<script>
import FormButton from './FormButton.vue'
import { Cropper, CircleStencil } from 'vue-advanced-cropper'
import 'vue-advanced-cropper/dist/style.css'

export default {
  components: {
    Cropper,
    FormButton
  },
  props: {
    img: {
      type: String,
      default: null
    },
    imgType: {
      type: String,
      default: null
    }
  },
  data: () => ({
    CircleStencil,
    image: null,
    croppedImg: null
  }),
  mounted() {
    this.image = this.img
  },
  methods: {
    close() {
      this.$refs.modal.close()
    },

    imageCropped({ canvas }) {
      canvas.toBlob((blob) => {
        this.croppedImg = blob
      }, this.imgType)
    },

    finish() {
      this.$emit('imageCropped', this.croppedImg)
      this.close()
    }
  }
}
</script>
<style></style>
