<template>
  <VueModal size="md" position="right" class="vt-filters-modal" ref="modal">
    <template #title>
      <span class="material-symbols-outlined"> tune </span>
      <span>FILTERS</span>
    </template>
    <template #body>
      <VueTableFiltersSection label="Show Items" :options="showOpts" v-model="result.showing" />
      <VueTableFiltersSection label="Sort By" :options="sortOpts" v-model="result.sort" />
      <VueTableFiltersSection
        section-type="select-multiple"
        label="Hidden Columns"
        :options="hideOpts"
        v-model="result.hidden"
        v-if="hideOpts.length"
      />

      <VueTableFiltersSection
        v-for="(f, fi) of filters"
        :key="fi"
        :section-type="f.type"
        :options="f.options"
        :label="f.title"
        :moduleName="f.module"
        v-model="result[f.column]"
      />
    </template>
    <template #footer>
      <a href="#" class="underlined text-dark" @click="clearAll">Clear All</a>
      <button class="btn btn-sm btn-dark" @click="applyFilters">Apply filters</button>
    </template>
  </VueModal>
</template>

<script>
import VueModal from '@/components/Modal/VueModal.vue'
import VueTableFiltersSection from './VueTableFiltersSection.vue'

export default {
  props: {
    modelValue: {
      type: Object,
      default: () => ({})
    },
    showOpts: {
      type: Array,
      default: () => []
    },
    sortOpts: {
      type: Array,
      default: () => []
    },
    hideOpts: {
      type: Array,
      default: () => []
    },
    filters: {
      type: Array,
      default: () => []
    }
  },
  components: {
    VueModal,
    VueTableFiltersSection
  },
  data: () => ({
    result: {}
  }),
  mounted() {
    this.initResult()
  },
  methods: {
    close() {
      this.$refs.modal.close()
    },
    initResult() {
      this.result = JSON.parse(JSON.stringify(this.modelValue))
    },
    clearAll() {
      this.$emit('clearFilters')

      this.$nextTick(() => {
        this.initResult()
      })
    },
    applyFilters() {
      this.$emit('filter', this.result)
      this.close()
    }
  }
}
</script>
