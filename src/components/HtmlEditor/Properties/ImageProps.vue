<template>
  <div class="d-flex justify-content-between align-items-center mb-2">
    <h6 class="label">Image</h6>
  </div>
  <FormText label="Image URL" flex-field v-model="img_src">
    <FormButton small icon="fa fa-image" @click="openMediaLibrary" tooltip="Open Media Library" />
  </FormText>
  <FormNumber label="Width" flex-field v-model="width">
    <button class="unit" @click="changeUnit">{{ unit }}</button>
  </FormNumber>
  <FormSelect label="Position" flex-field :options="position_options" v-model="text_align" />

  <!-- Media Library modal -->
  <MediaLibrary v-if="showForm" @close="showForm = false" @onSelectImage="selectImage" />
</template>

<script>
import FormText from '@/components/Form/FormText.vue'
import FormNumber from '@/components/Form/FormNumber.vue'
import FormSelect from '@/components/Form/FormSelect.vue'
import FormButton from '@/components/Form/FormButton.vue'
import MediaLibrary from '@/components/HtmlEditor/Properties/MediaLibrary.vue'

export default {
  components: {
    FormText,
    FormSelect,
    FormButton,
    FormNumber,
    MediaLibrary
  },
  props: { modelValue: { type: Object } },
  emits: ['update:modelValue'],
  data: () => ({
    position_options: ['left', 'center', 'right'],
    img_src: null,
    width: 100,
    text_align: 'left',
    unit: '%',
    showForm: false
  }),
  watch: {
    // Child Props
    img_src(val) {
      if (!val) {
        this.result.child.src = undefined
      } else {
        this.result.child.src = val
      }
    },
    width(val) {
      if (!val) {
        this.result.child.style.width = undefined
      } else {
        this.result.child.style.width = `${val}${this.unit}`
      }
    },
    unit(val) {
      if (!this.width) {
        this.result.child.style.width = undefined
      } else {
        this.result.child.style.width = `${this.width}${val}`
      }
    },

    // Container Props
    text_align(val) {
      if (!val) {
        this.result.style.textAlign = undefined
      } else {
        this.result.style.textAlign = val
      }
    }
  },
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
  mounted() {
    if (this.modelValue) {
      Object.keys(this.modelValue).forEach((key) => {
        if (key === 'style') {
          Object.keys(this.modelValue[key]).forEach((prop) => {
            this.propSetter(prop, this.modelValue[key][prop])
          })
        } else if (key === 'child') {
          Object.keys(this.modelValue[key]).forEach((prop) => {
            if (prop === 'src') {
              this.img_src = this.modelValue[key][prop]
            } else if (prop === 'style') {
              Object.keys(this.modelValue[key][prop]).forEach((childProp) => {
                this.propSetter(childProp, this.modelValue[key][prop][childProp])
              })
            }
          })
        }
      })
    }
  },
  methods: {
    propSetter(prop, value) {
      const props = {
        width: 'width',
        textAlign: 'text_align'
      }

      if (this[props[prop]] !== undefined) {
        if (!value) {
          this[props[prop]] = null
        } else if (prop === 'width') {
          if (value.slice(-1) === '%') {
            this[props[prop]] = value.slice(0, -1)
            this.unit = '%'
          } else {
            this[props[prop]] = value.slice(0, -2)
            this.unit = 'px'
          }
        } else {
          this[props[prop]] = value
        }
      }
    },
    changeUnit() {
      this.unit = this.unit === '%' ? 'px' : '%'
    },
    selectImage(selectedImage) {
      this.img_src = selectedImage.public_url
    },
    openMediaLibrary() {
      this.showForm = true
    }
  }
}
</script>
