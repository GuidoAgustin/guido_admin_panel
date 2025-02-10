<template>
  <div class="d-flex justify-content-between align-items-center">
    <h6 class="label">Background</h6>
  </div>

  <FormColorpicker label="Background color" flex-field v-model="background_color" />
  <FormText label="Background image URL" flex-field v-model="background_image">
    <FormButton small icon="fa fa-image" @click="openMediaLibrary" tooltip="Open Media Library" />
  </FormText>
  <FormSelect
    label="Background position"
    flex-field
    :options="positionOptions"
    v-model="background_position"
    v-if="background_image"
  />
  <FormSelect
    label="Background size"
    flex-field
    :options="sizeOptions"
    v-model="background_size"
    v-if="background_image"
  />
  <FormSelect
    label="Background repeat"
    flex-field
    :options="repeatOptions"
    v-model="background_repeat"
    v-if="background_image"
  />

  <MediaLibrary v-if="showForm" @close="showForm = false" @onSelectImage="selectImage" />
</template>

<script>
import FormColorpicker from '@/components/Form/FormColorpicker.vue'
import FormText from '@/components/Form/FormText.vue'
import FormSelect from '@/components/Form/FormSelect.vue'
import MediaLibrary from '@/components/HtmlEditor/Properties/MediaLibrary.vue'
import FormButton from '@/components/Form/FormButton.vue'
import { removeUrl } from '../composables'

export default {
  components: {
    FormColorpicker,
    FormText,
    FormSelect,
    MediaLibrary,
    FormButton
  },
  props: { modelValue: { type: Object, default: () => ({}) } },
  emits: ['update:modelValue'],
  data: () => ({
    positionOptions: [
      'center',
      'top',
      'bottom',
      'left',
      'right',
      'top left',
      'top right',
      'bottom left',
      'bottom right'
    ],
    sizeOptions: ['auto', 'cover', 'contain'],
    repeatOptions: ['repeat', 'no-repeat', 'repeat-y', 'repeat-x'],

    background_color: null,
    background_image: null,
    background_position: null,
    background_size: null,
    background_repeat: null,
    showForm: false
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
  watch: {
    background_color(val) {
      if (!val) {
        this.result.backgroundColor = undefined
      } else {
        this.result.backgroundColor = val
      }
    },
    background_image(val) {
      if (!val) {
        this.result.backgroundImage = undefined
      } else {
        this.result.backgroundImage = `url('${val}')`
      }
    },
    background_position(val) {
      if (!val) {
        this.result.backgroundPosition = undefined
      } else {
        this.result.backgroundPosition = val
      }
    },
    background_size(val) {
      if (!val) {
        this.result.backgroundSize = undefined
      } else {
        this.result.backgroundSize = val
      }
    },
    background_repeat(val) {
      if (!val) {
        this.result.backgroundRepeat = undefined
      } else {
        this.result.backgroundRepeat = val
      }
    }
  },
  mounted() {
    if (this.modelValue) {
      Object.keys(this.modelValue).forEach((key) => {
        this.propSetter(key, this.modelValue[key])
      })
    }
  },
  methods: {
    propSetter(prop, value) {
      const props = {
        backgroundColor: 'background_color',
        backgroundImage: 'background_image',
        backgroundPosition: 'background_position',
        backgroundSize: 'background_size',
        backgroundRepeat: 'background_repeat'
      }

      if (!value) {
        this[props[prop]] = null
      } else if (prop === 'backgroundImage') {
        this[props[prop]] = removeUrl(value)
      } else {
        this[props[prop]] = value
      }
    },
    onFileUploaded({ base64 }) {
      this.background_image = base64
    },
    selectImage(selectedImage) {
      this.background_image = selectedImage.public_url
    },
    openMediaLibrary() {
      this.showForm = true
    }
  }
}
</script>
