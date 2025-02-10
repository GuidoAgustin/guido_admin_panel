<template>
  <Accordion title="Column Properties" open-on-init>
    <FormSelect label="Column" :options="columnOptions" v-model="selColumnIx" flex-field>
      <FormButton theme="danger" class="ml-1" small @click="removeColumn(selColumnIx)">
        <i class="fa fa-trash"></i>
      </FormButton>
    </FormSelect>

    <BackgroundProps v-model="selectedColumn.style" :key="`bg_${selectedColumn.key}`" />
    <PaddingProps v-model="selectedColumn.style" :key="`pd_${selectedColumn.key}`" />
    <BorderProps v-model="selectedColumn.style" :key="`b_${selectedColumn.key}`" />
  </Accordion>
</template>

<script>
import Accordion from '@/components/Accordion.vue'
import FormButton from '@/components/Form/FormButton.vue'
import FormSelect from '@/components/Form/FormSelect.vue'
import PaddingProps from './PaddingProps.vue'
import BorderProps from './BorderProps.vue'
import BackgroundProps from './BackgroundProps.vue'

export default {
  components: {
    Accordion,
    FormSelect,
    BackgroundProps,
    PaddingProps,
    BorderProps,
    FormButton
  },
  props: {
    modelValue: Array,
    selectedColIndex: Number
  },
  emits: ['update:modelValue'],
  data: () => ({
    selColumnIx: 0
  }),
  computed: {
    columns: {
      get() {
        return this.modelValue
      },
      set(val) {
        this.$emit('update:modelValue', val)
      }
    },
    selectedColumn() {
      return this.columns[this.selColumnIx]
    },
    columnOptions() {
      return this.columns.map((x, i) => ({ value: i, label: `Column ${i + 1}` }))
    }
  },
  created() {
    if (this.selectedColIndex) {
      this.selColumnIx = this.selectedColIndex
    }
  },
  methods: {
    async removeColumn(ix) {
      await this.$confirm({
        title: 'Deleting column',
        text: 'Are you sure?'
      })

      const aux = [...this.columns]
      aux.splice(ix, 1)

      this.columns = aux
      this.selColumnIx = 0
    }
  }
}
</script>

<style></style>
