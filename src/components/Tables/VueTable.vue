<template>
  <div class="v-table">
    <VueTableFilters
      v-show="!noFilters"
      :searchable="opts.searchable"
      :exportable="exportable"
      :filters="filters"
      :headers="headers"
      :searchHelper="searchHelper"
      @search="searched"
      @filter="filtered"
      @onExport="onExport"
    />

    <table :class="opts.tableClass">
      <thead :class="opts.theadClass">
        <tr>
          <th v-if="checkeable" width="1%">
            <input v-model="checkAll" type="checkbox" />
          </th>
          <template v-for="head in visibleHeaders" :key="head.key">
            <th :style="{ width: head.width ? head.width + '%' : 'auto' }">
              {{ head.mask || head.title.replaceAll('_', ' ').ucwords() }}
            </th>
          </template>
          <th style="width: 1%" v-if="actions?.length" />
        </tr>
      </thead>
      <tbody :class="opts.tbodyClass">
        <template
          v-if="
            !values ||
            values.length === 0 ||
            (Object.keys(values).length === 0 && values.constructor === Object)
          "
        >
          <tr>
            <td :colspan="visibleHeaders.length + 1" style="text-align: center">
              <loader />
            </td>
          </tr>
        </template>
        <tr
          v-for="(item, a) in values.data"
          :key="item.id"
          @mousedown="startHoldTimer"
          @mouseup="endHoldTimer"
          @mouseleave="cancelHoldTimer"
          @click.stop="handleClick(item, a)"
          @click.stop.middle="rowClicked(item, a, true)"
          :class="{ 'v-table-row-clickeable': clickeableRows }"
        >
          <td @click.stop v-if="checkeable">
            <input
              v-model="item.checked"
              type="checkbox"
              @click.stop="$emit('itemChecked', a, $event.target.checked)"
            />
          </td>

          <td
            v-for="(head, b) in visibleHeaders"
            :key="b"
            :class="{
              'v-table-editable-td': head.editable,
              'v-table-just-button': head.justButton
            }"
            :data-cell="(head.mask || head.title).replaceAll('_', ' ').ucwords()"
          >
            <template v-if="head.slot">
              <div>
                <slot :name="head.slot" :item="item" :index="a" />
              </div>
            </template>

            <template v-else-if="head.editable">
              <div
                v-if="head.editable !== 'checkbox'"
                class="v-table-input-container"
                :class="opts.inputContainerClass"
              >
                <input
                  v-if="['text', 'number'].includes(head.editable)"
                  class="v-table-input"
                  :class="opts.inputClass"
                  :type="head.editable"
                  :value="nestedTitle(item, head.title)"
                  @input="$emit('editableInput', a, head.title, $event.target.value)"
                  @change="$emit('editableChange', a, head.title, $event.target.value)"
                />
                <select
                  v-if="head.editable === 'select'"
                  :class="opts.inputClass"
                  class="v-table-input"
                  :value="nestedTitle(item, head.title)"
                  @input="$emit('editableInput', a, head.title, $event.target.value)"
                  @change="$emit('editableChange', a, head.title, $event.target.value)"
                >
                  <option v-for="o in head.options" :key="o.id" :value="o.id">
                    {{ o.label }}
                  </option>
                </select>
              </div>
              <div v-else class="v-table-checkbox-container" :class="opts.checkboxContainerClass">
                <input
                  class="v-table-checkbox"
                  :class="opts.checkboxClass"
                  :type="head.editable"
                  :checked="nestedTitle(item, head.title)"
                  @input="$emit('editableInput', a, head.title, $event.target.checked)"
                  @change="$emit('editableChange', a, head.title, $event.target.checked)"
                />
              </div>
            </template>

            <template v-else>
              <span v-if="head.htmlFormat === true" v-html="parseValue(item, head)" />
              <div v-else :title="parseValue(item, head, true)">
                <b v-if="head.strong">
                  {{ parseValue(item, head) }}
                </b>
                <span v-else>
                  {{ parseValue(item, head) }}
                </span>
              </div>
            </template>
          </td>

          <td class="vt-actions-cell" v-if="actions?.length">
            <div>
              <button
                v-if="canMoveRows"
                class="btn btn-sm btn-borderless-dark"
                @click.stop="actionSortRow(item, 'decrease')"
                style="position: relative"
              >
                <i class="fa-solid fa-arrow-up"></i>
              </button>
              <button
                v-if="canMoveRows"
                class="btn btn-sm btn-borderless-dark"
                @click.stop="actionSortRow(item, 'increase')"
                style="position: relative"
              >
                <i class="fa-solid fa-arrow-down"></i>
              </button>
              <FormDropdown position="bottom">
                <template #action="{ open }">
                  <button class="btn btn-sm btn-borderless-dark actions-btn" @click.stop="open">
                    <i class="fa fa-ellipsis"></i>
                  </button>
                </template>
                <template #default="{ close }">
                  <template v-for="(act, i) in actions">
                    <div :key="i" v-if="!act.hideWhenFn || !act.hideWhenFn(item)">
                      <router-link
                        v-if="act.to"
                        :to="act.to(item)"
                        class="btn btn-borderless-dark justify-content-left text-left w-100"
                      >
                        <small>{{ act.title }}</small>
                      </router-link>
                      <button
                        v-else
                        class="btn btn-borderless-dark justify-content-left text-left w-100"
                        @click.stop="actionClicked(act, item, a, close)"
                        @click.stop.middle="actionClicked(act, item, a, close, true)"
                      >
                        <small>{{ act.title }}</small>
                      </button>
                    </div>
                  </template>
                </template>
              </FormDropdown>
            </div>
          </td>
        </tr>
      </tbody>
      <tfoot v-if="values.data && values.data.length <= 0">
        <tr>
          <td colspan="1000" style="text-align: center">No data to show</td>
        </tr>
      </tfoot>
      <tfoot v-else-if="$slots.footer">
        <tr>
          <slot name="footer" />
        </tr>
      </tfoot>
    </table>

    <VueTablePager
      :from="values.from"
      :to="values.to"
      :total="values.total"
      :last-page="values.last_page"
      @changing_page="pageChanged"
    />
  </div>
</template>

<script>
/**
 * Valores recibidos
 *
 * # HEADERS
 * - title : string / nullable
 * - mask : string / nullable
 * - width: number(%) / nullable
 * - max_chars: number / nullable
 * - htmlFormat: bool / will parse string into html
 * - dateFormat: bool
 * - dateTimeFormat: bool
 * - dateLocaleFormat: bool
 * - boolean: bool
 * - booleanValues: Object / { true: 'Value for true', false: 'Value for false' }
 * - pre: string / concatenated at beginning
 * - after: string / concatenated at end
 * - sortable: bool
 * - hideable: bool
 * - callback: function(item) / return string to display in cell
 * - slot: string / will create a slot to overwrite cell
 *
 * # VALUES
 * - pagination from laravel (https://laravel.com/docs/5.8/pagination)
 *
 * # ACTIONS
 * - callback
 * - title
 * - hideWhenFn // filter function to hide
 * - to: function(item) / item will be passed as parameter. must return a vuerouter link
 *
 * # FILTERS
 * - title
 * - type: select/select-multiple/combobox/date/date-range/number
 * - options: array/null
 * - column // Column to filter
 * - module: string/null (only for combobox/select)
 *
 * # OPTIONS
 * - tableClass
 * - theadClass
 * - tbodyClass
 */

/**
 * Valores Emitidos
 * - changed (se modifican los parametros de busqueda)
 */
import './utils/ucwords'
import VueTableFilters from './VueTableFilters.vue'
import VueTablePager from './VueTablePager.vue'
import FormDropdown from '@/components/Form/FormDropdown.vue'
import loader from './loader.vue'
import { parseToString, parseToLocale } from '@/utils/date'
import { useClickAndHold } from './utils/useClickAndHold'

export default {
  name: 'VueTables',
  components: {
    VueTableFilters,
    VueTablePager,
    FormDropdown,
    loader
  },
  props: {
    headers: {
      type: Array,
      default: null
    },
    values: {
      type: Object,
      default: null
    },
    options: {
      type: Object,
      default: null
    },
    actions: {
      type: Array,
      default: () => []
    },
    filters: {
      type: Array,
      default: () => []
    },
    truncate: {
      type: [Number, Boolean],
      default: 80
    },
    searchMinLen: {
      type: Number,
      default: 3
    },
    exportable: {
      type: Boolean,
      default: false
    },
    noFilters: {
      type: Boolean,
      default: false
    },
    canMoveRows: {
      type: Boolean,
      default: false
    },
    checkeable: Boolean,
    clickeableRows: Boolean,
    searchHelper: String
  },
  data() {
    return {
      opts: {
        tableClass: 'table table-hover',
        theadClass: '',
        tbodyClass: '',
        checkeable: false,
        searchable: true,
        inputContainerClass: '',
        inputClass: '',
        checkboxContainerClass: '',
        checkboxClass: ''
      },
      sortedBy: '',
      sortedDir: 'asc',
      date_column: null,
      vTableParams: {
        page: 1,
        search: null,
        sort_by: null,
        sort_dir: null,
        per_page: 10,
        hidden_cols: [],
        filters: null
      },
      checkAll: false
    }
  },
  setup() {
    // Use composable here
    const { isHold, startHoldTimer, endHoldTimer, cancelHoldTimer } = useClickAndHold(250)

    return {
      isHold,
      startHoldTimer,
      endHoldTimer,
      cancelHoldTimer
    }
  },
  watch: {
    checkAll: {
      handler(val) {
        this.$emit('checkAll', val)
      }
    }
  },
  computed: {
    visibleHeaders() {
      return this.headers.filter((x) => !this.vTableParams.hidden_cols.includes(x.title))
    }
  },
  mounted() {
    if (!this.values)
      throw new Error('Input VALUES is empty, please add data. (eg.: :values="myData")')
    if (!this.headers)
      throw new Error('Input HEADERS is empty, please add data. (eg.: :headers="myHeaders")')

    if (this.options) {
      Object.keys(this.options).forEach((key) => {
        if (key in this.opts) {
          if (key === 'checkeable' && typeof this.options[key] !== 'boolean') {
            throw new Error('Options "checkeable" must be a Boolean')
          }
          if (key === 'searchable' && typeof this.options[key] !== 'boolean') {
            throw new Error('Options "searchable" must be a Boolean')
          }
          this.opts[key] = this.options[key]
        }
      })
    }
  },
  methods: {
    pageChanged(val) {
      this.vTableParams.page = val
      this.changed()
    },
    searched(val) {
      if (val && val.length <= this.searchMinLen) {
        this.$toast.error('Search value is too short')
        return
      }

      this.vTableParams.page = 1
      this.vTableParams.search = val
      this.changed()
    },
    filtered(val) {
      const { sort, showing, hidden, ...filters } = val

      if (sort && sort !== 'null') {
        const [by, dir] = sort.split('__')

        this.vTableParams.sort_by = by
        this.vTableParams.sort_dir = dir
      } else {
        this.vTableParams.sort_by = null
        this.vTableParams.sort_dir = null
      }

      if (showing !== this.vTableParams.per_page) {
        this.vTableParams.page = 1
        this.vTableParams.per_page = showing
      }

      if (hidden) {
        this.vTableParams.hidden_cols = hidden
      }

      const FILTERS_CHANGED = JSON.stringify(filters) !== JSON.stringify(this.vTableParams.filters)
      if (filters && FILTERS_CHANGED) {
        this.vTableParams.page = 1
        this.vTableParams.filters = filters
      }

      this.changed()
    },

    changed() {
      const { sort_by, sort_dir, page, per_page, search, filters } = this.vTableParams

      this.$emit('changed', {
        sort_by,
        sort_dir,
        page,
        per_page,
        search,
        ...this.parseFilters(filters)
      })
    },

    parseFilters(filters) {
      const allowedSubKeys = ['start', 'end', 'value']
      const aux = {}

      const notNull = (val) => val !== null && val !== undefined

      for (const key of Object.keys(filters)) {
        const filter = filters[key]

        if (typeof filter === 'object' && !Array.isArray(filter) && filter !== null) {
          for (const subkey of Object.keys(filters[key])) {
            if (allowedSubKeys.includes(subkey)) {
              if (notNull(filters[key][subkey])) {
                if (subkey === 'value') {
                  aux[`${key}`] = filters[key][subkey]
                } else {
                  aux[`${key}_${subkey}`] = filters[key][subkey]
                }
              }
            }
          }
        } else if (notNull(filters[key])) {
          aux[key] = filters[key]
        }
      }

      return aux
    },

    nestedTitle(item, val) {
      const value = item[val]
      if (!value) {
        const array = val.split('.')
        let aux = item

        array.forEach((attr) => {
          aux = aux[attr] === null || aux[attr] === undefined ? '-' : aux[attr]
        })
        return aux
      }
      return value
    },

    parseValue(item, head, full = false) {
      let result = this.nestedTitle(item, head.title)

      if (head.dateFormat === true && result !== '-') result = parseToString(result) // YYYY-MM-DD
      else if (head.dateTimeFormat === true && result !== '-')
        result = parseToString(result, true) // YYYY-MM-DD HH:mm
      else if (head.dateLocaleFormat === true && result !== '-')
        result = parseToLocale(result) // MMM DD, YYYY
      else if (head.dateTimeLocaleFormat === true && result !== '-')
        result = parseToLocale(result, true) // HH:mm - MMM DD, YYYY
      else if (head.boolean === true) {
        if (head.booleanValues) {
          result = head.booleanValues[result === true]
        } else {
          const defaultValues = { true: 'YES', false: 'NO' }
          result = defaultValues[result == true]
        }
      } else if (head.callback !== undefined) result = head.callback(result)

      if (head.pre) {
        if (['€', '$'].includes(head.pre)) {
          if (typeof result === 'number') {
            result = `${head.pre}${result.toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,')}`
          } else {
            result = `${head.pre}${parseFloat(result)
              .toFixed(2)
              .replace(/(\d)(?=(\d{3})+\.)/g, '$1,')}`
          }
        } else result = `${head.pre}${result}`
      }
      if (head.after) result = `${result}${head.after}`

      if (full) return result || '-'

      if (head.htmlFormat) {
        return result
      }

      if (head.max_chars && result.length > head.max_chars)
        result = `${result.slice(0, head.max_chars)}...`

      if (this.truncate && result?.length > this.truncate)
        result = `${result.slice(0, this.truncate)}...`

      return result || '-'
    },

    init() {
      this.$emit('changed', {
        search: null,
        sort_by: null,
        sort_dir: null,
        ...this.parseFilters(this.vTableParams.filters),
        page: 1,
        per_page: 10
      })
    },

    actionClicked(action, item, index, close, middleBtn = false) {
      this.$emit(action.callback, item, index, middleBtn)
      close()
    },
    onExport() {
      this.$emit('onExport', this.parseFilters(this.vTableParams.filters))
    },
    actionSortRow(row, action) {
      this.$emit('onChangeOrder', {
        row,
        newSort: action === 'increase' ? row.sort + 1 : row.sort - 1
      })
    },
    handleClick(item, index) {
      if (!this.isHold) {
        this.rowClicked(item, index)
      }
    },
    rowClicked(item, index, middleBtn = false) {
      if (!this.clickeableRows) return
      this.$emit('rowClicked', item, index, middleBtn)
    }
  }
}
</script>
