<template>
  <vue-modal @close="$emit('close')" ref="mediaLibraryModal" size="lg" position="center">
    <template #title>Media Library</template>
    <template #body>
      <section class="container-media-library">
        <section class="container-list">
          <section class="container-list-image">
            <div v-for="attachment in attachments" :key="attachment.title" class="imageContainer">
              <img
                :src="attachment.public_url"
                class="image-file"
                alt="attachment.title"
                width="100"
                height="100"
                :style="{ border: selectedImage === attachment ? '4px solid #34bec2' : 'none' }"
                @click="selectedImage = attachment"
              />
            </div>
          </section>
        </section>
        <section class="container-image-details">
          <h4 class="container-title-details">Attachment Details</h4>
          <div v-if="selectedImage" class="text-center">
            <div class="mb-4">
              <img
                :src="selectedImage?.public_url"
                class="image-file"
                alt="selectedImage title"
                width="200"
                height="200"
              />
            </div>
            <div>
              <h6 class="image-title">{{ selectedImage?.name }}</h6>
            </div>
          </div>
        </section>
      </section>
    </template>
    <template #footer>
      <FormUploader
        resetOnSelect
        class="mr-auto mb-0"
        buttonText="Add new image"
        @onChange="onFileUploaded"
      />

      <FormButton small theme="medium" class="mr-1" @click="close"> Cancel </FormButton>
      <FormButton small @click="selectImage"> Select Image </FormButton>
    </template>
  </vue-modal>
</template>

<script>
import FormButton from '@/components/Form/FormButton.vue'
import FormUploader from '@/components/Form/FormUploader.vue'

export default {
  components: {
    FormButton,
    FormUploader
  },
  data: () => ({
    img_src: null,
    showForm: false,
    selectedImage: null,
    attachments: []
  }),
  mounted() {
    this.getData()
  },
  methods: {
    close() {
      this.$refs.mediaLibraryModal.close()
    },
    getData() {
      this.$store.dispatch('showPublicImages').then((res) => {
        this.attachments = res
      })
    },
    async selectImage() {
      this.$emit('onSelectImage', this.selectedImage)
      this.close()
    },
    async onFileUploaded({ file }) {
      const fd = new FormData()
      fd.append('file', file)

      await this.$store.dispatch('createFile', fd)

      this.getData()
    }
  }
}
</script>

<style scoped>
.container-media-library {
  display: grid;
  grid-template-columns: 70% 30%;
  height: 70vh;
  gap: 1.5em;
}

.container-list {
  overflow-y: auto;
  padding-right: 5px;
}

.container-list-image {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
  gap: 10px;
}

.imageContainer {
  background-color: #bbc0c5;
  width: 100px;
}

.container-image-details {
  padding: 0 20px;
  background-color: #f7f7f7;
  color: black;
}

.container-title-details {
  font-size: 18px;
  padding-top: 1em;
  padding-bottom: 2em;
  margin-bottom: 0;
}

.image-file {
  object-fit: cover;
}

.image-title {
  font-size: 14px;
}
</style>
