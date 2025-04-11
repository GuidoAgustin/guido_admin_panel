<template>
  <FormUploader
    class="profile-uploader"
    label="Profile Picture"
    image-type
    @onChange="imageSelected"
    v-bind="$attrs"
  >
    <template #default="{ launchPicker }">
      <img
        :src="fileUrl || default_avatar"
        :class="{ disabled: !editable && !fileUrl }"
        @click="onClick(launchPicker)"
      />

      <div class="details" v-if="!noDetails">
        <h6 class="label m-0">Choose Picture</h6>
        <small>The image must be JPG or PNG</small>
        <small>The dimensions must be 300x300</small>
        <small>The size cannot be higher than 5mb</small>
        <small v-if="result">{{ result.name }} ({{ (result.size / 1024).toFixed(2) }}kb)</small>
      </div>
    </template>
  </FormUploader>

  <Gallery v-if="showGallery" :items="[{ url: fileUrl }]" @close="showGallery = false" />

  <FormImageCropper
    v-if="showCropper"
    :img="image_url"
    :img-type="imageType"
    @imageCropped="imageCropped"
    @close="showCropper = false"
  />
</template>

<script>
import Gallery from '../Gallery/Gallery.vue'
import FormImageCropper from './FormImageCropper.vue'
import FormUploader from './FormUploader.vue'

export default {
  inheritAttrs: false,
  components: { FormUploader, FormImageCropper, Gallery },
  props: {
    modelValue: {
      type: [Object, File, String]
    },
    fileUrl: {
      type: String
    },
    noDetails: Boolean,
    editable: Boolean
  },
  data: () => ({
    default_avatar: '/img/default-avatar.jpg',
    showCropper: false,
    showGallery: false,
    image_url: null,
    imageType: null,
    originalFile: null
  }),
  computed: {
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
    imageSelected({ file }) {
      this.originalFile = file

      const imageURL = URL.createObjectURL(file)
      this.image_url = imageURL
      this.showCropper = true
      this.imageType = file.type
      this.$forceUpdate()
    },
    imageCropped(blob) {
      const imageURL = URL.createObjectURL(blob)

      // Convert blob to file
      const file = blob
      file.lastModifiedDate = new Date()
      file.name = this.originalFile.name

      this.result = file
      this.$emit('update:fileUrl', imageURL)
    },
    onClick(launchPicker) {
      if (this.editable) {
        launchPicker()
      } else if (this.fileUrl) {
        this.showGallery = true
      }
    }
  }
}
</script>
