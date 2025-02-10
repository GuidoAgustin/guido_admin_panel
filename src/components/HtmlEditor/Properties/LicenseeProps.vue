<template>
  <div class="d-flex justify-content-between align-items-center">
    <h6 class="label">Licensee Fields</h6>
  </div>

  <FormSwitch
    label="Show Main Customer ONLY"
    flex-field
    v-model="result.properties.show_main"
    @change="parseHtml"
    small
  />

  <FormButton
    class="mb-1 d-flex"
    icon="fa fa-code"
    block
    small
    theme="secondary"
    @click="show_html = !show_html"
    :disabled="!htmlComplete"
  >
    {{ show_html ? 'Hide html' : 'Show html' }}
  </FormButton>

  <div v-if="show_html">
    <div class="alert alert-primary small">
      <ul class="ml-3 mb-0">
        <li>It's recommended to use the field editor below instead of editing HTML directly</li>
        <li>If you remove or modify any fields, the HTML will be automatically recalculated</li>
        <li>
          If you edit the HTML directly, remember to use inline styles for consistent formatting
        </li>
      </ul>
    </div>
    <FormCode label="Licensor HTML" v-model="result.properties.html" />
  </div>
  <FormButton class="mb-3 d-flex" icon="fa fa-plus" block small @click="addField">
    Add field
  </FormButton>

  <div class="d-grid gap-1">
    <div class="alert alert-primary" v-if="!result.properties.fields?.length">
      Please add fields to this section
    </div>
    <div class="alert alert-primary" v-else-if="!htmlComplete">
      Some fields are missing title or value
    </div>

    <template v-if="result.properties.fields?.length">
      <Accordion
        v-for="(field, index) in result.properties.fields"
        :key="index"
        :title="`Field #${index + 1}`"
        :hasError="!field.title || !field.value"
      >
        <FormText label="Title" v-model="field.title" flex-field @change="parseHtml" />
        <FormSelect
          label="Field Value"
          :options="valueOptions"
          v-model="field.value"
          flex-field
          @change="parseHtml"
          @onSelect="field.title = $event.label"
        />
        <FormText
          v-if="field.value === 'custom'"
          label="Custom Value"
          v-model="field.custom_value"
          flex-field
          @change="parseHtml"
        />

        <FormButton
          theme="danger"
          class="mt-2 d-flex"
          icon="fa fa-trash"
          small
          block
          @click="removeField(index)"
        >
          Remove field
        </FormButton>
      </Accordion>
    </template>
  </div>
</template>

<script>
import FormText from '@/components/Form/FormText.vue'
import FormSelect from '@/components/Form/FormSelect.vue'
import FormButton from '@/components/Form/FormButton.vue'
import FormSwitch from '@/components/Form/FormSwitch.vue'
import FormCode from '@/components/Form/FormCode.vue'
import Accordion from '@/components/Accordion.vue'

export default {
  components: {
    FormText,
    FormSelect,
    FormButton,
    FormSwitch,
    FormCode,
    Accordion
  },
  props: { modelValue: { type: Object, default: () => ({}) } },
  emits: ['update:modelValue'],
  data: () => ({
    show_html: false,
    valueOptions: [
      { label: 'Name', value: 'name' },
      { label: 'Email', value: 'email' },
      { label: 'Phone', value: 'phone' },
      { label: 'Passport', value: 'passport' },
      { label: 'Check in date', value: 'check_in_date' },
      { label: 'Check out date', value: 'check_out_date' },
      { label: 'Property name', value: 'property_name' },
      { label: 'Property full address', value: 'property_full_address' },
      { label: 'Property address', value: 'property_address' },
      { label: 'Property city', value: 'property_city' },
      { label: 'Property zip code', value: 'property_zip_code' },
      { label: 'Property zone', value: 'property_zone' },
      { label: 'Property country', value: 'property_country' },
      { label: 'Property room', value: 'property_room' },
      { label: 'Property bed', value: 'property_bed' },
      { label: 'Price', value: 'price' },
      { label: 'Custom value', value: 'custom' }
    ]
  }),
  computed: {
    result: {
      get() {
        return this.modelValue
      },
      set(val) {
        this.$emit('update:modelValue', val)
      }
    },
    htmlComplete() {
      const hasFields = this.result.properties.fields?.length
      const fieldsCompleted = this.result.properties.fields.every((x) => x.title && x.value)

      return hasFields && fieldsCompleted
    }
  },
  mounted() {
    if (!this.result.properties.html) {
      this.parseHtml()
    }
  },
  methods: {
    addField() {
      const field = {
        title: null,
        value: null,
        custom_value: null
      }
      if (this.result.properties.fields) {
        this.result.properties.fields.push({
          title: null,
          value: null,
          custom_value: null
        })
      } else {
        this.result.properties.fields = [field]
      }

      this.parseHtml()
    },
    removeField(index) {
      this.result.properties.fields.splice(index, 1)

      this.parseHtml()
    },

    parseHtml() {
      if (!this.result.properties.fields?.length) {
        this.result.properties.html = ''
      } else {
        const fields = this.result.properties.fields
        const midPoint = Math.ceil(fields.length / 2)
        const leftFields = fields.slice(0, midPoint)
        const rightFields = fields.slice(midPoint)
        const { show_main } = this.result.properties

        const renderField = (field) => {
          const val =
            field.value === 'custom'
              ? field.custom_value
              : `{{${show_main ? 'main_licensee' : 'licensee'}.${field.value}}}`

          return `<p>
            <strong>${field.title}:</strong>
            ${val}
          </p>`
        }

        const mainHtml = `<table style="width: 100%; margin-top: 5px; margin-bottom: 5px;">
  <tr>
    <td>
      ${leftFields.map(renderField).join('')}
    </td>
    <td>
      ${rightFields.map(renderField).join('')}
    </td>
  </tr>
</table>`

        if (show_main) {
          this.result.properties.html = mainHtml
        } else {
          this.result.properties.html = `{{#each licensees as |licensee|}}\n${mainHtml}\n{{/each}}`
        }
      }
    }
  }
}
</script>
