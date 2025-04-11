<template>
  <div class="form-gallery-uploader">
    <label>{{ label }}</label>
    <div class="form-gallery-items-wrapper" :style="wrapperStyles">
      <FormUploader
        class="form-gallery-item add-item form-uploader bg-primary bg-hover-primary-shade"
        image-type
        @onChange="imageSelected"
        reset-on-select
        multiple
      >
        <template #default="{ launchPicker }">
          <div @click="launchPicker">
            <i class="fa fa-image"></i>
            <h6 class="label m-0">Add Photo</h6>
          </div>
        </template>
      </FormUploader>

      <div
        class="form-gallery-item"
        v-for="(img, ix) of modelValue"
        :key="ix"
        :style="`background-image: url('${img.url}')`"
        @click.stop="openGallery(ix)"
      >
        <button class="btn btn-danger btn-rounded" @click.stop="removePhoto(ix)">
          <i class="fa fa-trash"></i>
        </button>
      </div>
    </div>
  </div>

  <Gallery
    v-if="showGallery"
    @close="showGallery = false"
    :items="modelValue"
    :selectedIndex="selectedIndex"
  />
</template>

<script>
import FormUploader from './FormUploader.vue'
import Gallery from '../Gallery/Gallery.vue'

export default {
  components: {
    FormUploader,
    Gallery
  },
  props: {
    label: {
      type: String,
      default: 'Gallery'
    },
    modelValue: {
      type: Array,
      default: () => []
    },
    responsiveItems: {
      type: Object,
      default: () => ({
        0: { items: 3 },
        350: { items: 5 },
        512: { items: 6 },
        768: { items: 10 }
      })
    },
    onAdd: Function,
    onDelete: Function
  },
  mounted() {
    window.addEventListener('resize', this.onResize)
    this.onResize()
  },
  beforeUnmount() {
    window.removeEventListener('resize', this.onResize)
  },
  data: () => ({
    columns: 3,
    showGallery: false,
    selectedIndex: 0
  }),
  computed: {
    wrapperStyles() {
      return `--cols: ${this.columns}`
    }
  },
  methods: {
    onResize() {
      Object.keys(this.responsiveItems).map((minWidth) => {
        if (window.innerWidth > minWidth) {
          this.columns = this.responsiveItems[minWidth].items
        }
      })
    },
    async imageSelected(imgs) {
      for (const img of imgs) {
        let file_id
        if (this.onAdd) {
          file_id = await this.onAdd(img)
        }
        this.$emit('update:modelValue', [...this.modelValue, { ...img, file_id }])
      }
    },
    async removePhoto(ix) {
      if (this.onDelete) {
        await this.onDelete(this.modelValue[ix])
      }

      const aux = [...this.modelValue]

      aux.splice(ix, 1)
      this.$emit('update:modelValue', aux)
    },
    openGallery(index) {
      this.showGallery = true
      this.selectedIndex = index
    }
  }
}
</script>

<style></style>
