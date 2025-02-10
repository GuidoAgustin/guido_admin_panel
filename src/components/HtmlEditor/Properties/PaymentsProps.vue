<template>
  <div class="d-flex justify-content-between align-items-center mb-2">
    <h6 class="label">Payments data</h6>
  </div>

  <FormButton
    class="mb-1 d-flex"
    icon="fa fa-code"
    block
    small
    theme="secondary"
    @click="show_html = !show_html"
  >
    {{ show_html ? 'Hide html' : 'Show html' }}
  </FormButton>

  <div v-if="show_html">
    <div class="alert alert-primary small">
      <ul class="ml-3 mb-0">
        <li>
          If you edit the HTML directly, remember to use inline styles for consistent formatting
        </li>
        <li>This template is used to generate the HTML for the payments section.</li>
        <li>
          Please avoid removing any special syntax here (anything between double curly braces
          <span v-html="`{{}}`" /> )
        </li>
      </ul>
    </div>
    <FormCode label="Licensor HTML" v-model="result.properties.html" />
  </div>

  <template v-if="result.properties.statuses || result.properties.items">
    <FormSelect
      label="Statuses to show"
      :options="statusOptions"
      v-model="result.properties.statuses"
      multiple
    />
    <ItemsSelect label="Item" v-model="result.properties.items" multiple />
  </template>
</template>

<script>
import FormButton from '@/components/Form/FormButton.vue'
import FormCode from '@/components/Form/FormCode.vue'
import FormSelect from '@/components/Form/FormSelect.vue'
import ItemsSelect from '@/components/Selects/ItemsSelect.vue'

export default {
  components: {
    FormSelect,
    ItemsSelect,
    FormButton,
    FormCode
  },
  props: { modelValue: { type: Object, default: () => ({}) } },
  emits: ['update:modelValue'],
  data: () => ({
    show_html: false,
    statusOptions: [
      { label: 'Unpaid', value: 'Unpaid' },
      { label: 'Paid', value: 'Paid' },
      { label: 'Overdue', value: 'Overdue' },
      { label: 'Cancelled', value: 'Cancelled' },
      { label: 'Rejected', value: 'Rejected' },
      { label: 'Void', value: 'Void' },
      { label: 'Refunded', value: 'Refunded' },
      { label: 'To be refunded', value: 'To be refunded' }
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
    }
  },
  mounted() {
    if (this.modelValue && !this.modelValue.properties.statuses) {
      this.result.properties.statuses = []
    }

    if (this.modelValue && !this.modelValue.properties.items) {
      this.result.properties.items = []
    }

    this.parseHtml()
  },
  methods: {
    parseHtml() {
      if (!this.result.properties.html) {
        this.result.properties.html = `<table style="width: 100%; margin-top: 5px; margin-bottom: 5px;">
  <tr>
    <td colspan="2"><p><strong>Payments</strong></p></td>
  </tr>
  <tr>
    <td> Due Date </td>
    <td> Service </td>
    <td> Value </td>
  </tr>
  {{#each payments as |payment|}}
  <tr>
    <td> {{payment.due_date}} </td>
    <td> {{payment.service}} </td>
    <td> {{payment.value}} </td>
  </tr>
  {{/each}}
</table>`
      }
    }
  }
}
</script>
