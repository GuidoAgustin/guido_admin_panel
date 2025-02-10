<template>
  <Accordion title="Columns" :open-on-init="!result.length" ref="accordion">
    <div class="he-sections-columns">
      <div
        class="columns"
        :class="`columns-${col}`"
        v-for="col of Object.keys(cols)"
        :key="col"
        @click="changeRowCols(col)"
      >
        <div v-for="(cq, ci) of cols[col]" :key="`${col}_${ci}`">{{ cq }}%</div>
      </div>
    </div>
  </Accordion>
</template>

<script>
import Accordion from '@/components/Accordion.vue'
import { defaultCol, keyGen } from '../composables'

export default {
  components: {
    Accordion
  },
  props: {
    modelValue: Array
  },
  emits: ['update:modelValue'],
  data: () => ({
    cols: {
      1: [100],
      2: [50, 50],
      3: [33, 33, 33],
      4: [25, 25, 25, 25],
      5: [33, 66],
      6: [66, 33]
    }
  }),
  computed: {
    result: {
      get() {
        return [...this.modelValue]
      },
      set(val) {
        this.$emit('update:modelValue', val)
      }
    }
  },
  watch: {
    result(val) {
      if (!val.length) {
        this.$refs.accordion.open()
      }
    }
  },
  methods: {
    async changeRowCols(col) {
      const columns = this.cols[col].map((x) => ({
        ...defaultCol,
        key: keyGen(),
        style: {
          width: `${x}%`
        }
      }))
      const prevColsLen = this.result.length

      if (!prevColsLen) {
        this.result = columns
      } else if (prevColsLen < columns.length) {
        const aux = columns.map((x, xi) => {
          const existentCol = this.result[xi]

          if (existentCol) {
            x.style = columns[xi].style
            x.key = columns[xi].key
            x.children = existentCol.children
          } else {
            x.style = columns[xi].style
            x.key = columns[xi].key
          }

          return x
        })

        this.result = aux
      } else {
        const lostCols = this.result.length - columns.length
        await this.$confirm({
          title: `You will lose ${lostCols} columns.`,
          text: `Are you sure?`
        })

        const aux = this.result.slice(0, columns.length).map((x, xi) => {
          x.style = columns[xi].style
          x.key = columns[xi].key

          return x
        })

        this.result = aux
      }

      this.$refs.accordion.close()
    }
  }
}
</script>

<style></style>
