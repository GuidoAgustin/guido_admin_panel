<template>
  <table class="table form-table">
    <thead>
      <tr>
        <th v-if="checkeable" style="width: 1%">
          <input v-model="checkAll" type="checkbox" />
        </th>
        <th
          :style="{ width: head.width ? head.width + '%' : 'auto' }"
          v-for="head in headers"
          :key="head.key"
        >
          {{ head.mask || head.title.replaceAll('_', ' ').ucwords() }}
        </th>
        <th style="width: 1%" v-if="actions?.length" />
      </tr>
    </thead>
    <tbody>
      <tr v-for="(item, ix) of values" :key="ix">
        <td data-cell="Check" class="vt-checkbox" v-if="checkeable">
          <div>
            <input
              v-model="item.checked"
              type="checkbox"
              @click="$emit('itemChecked', ix, $event.target.checked)"
            />
          </div>
        </td>
        <td
          v-for="(head, b) in headers"
          :key="b"
          :data-cell="(head.mask || head.title).replaceAll('_', ' ').ucwords()"
        >
          <template v-if="head.slot">
            <div>
              <slot :name="head.slot" :item="item" :index="ix" />
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
            <FormDropdown position="bottom">
              <template #action="{ open }">
                <button class="btn btn-sm btn-borderless-dark actions-btn" @click="open">
                  <i class="fa fa-ellipsis"></i>
                </button>
              </template>
              <template #default="{ close }">
                <template v-for="(act, i) in actions">
                  <div :key="i" v-if="!act.hideWhenFn || !act.hideWhenFn(item)">
                    <router-link
                      v-if="act.to"
                      :to="act.to(item)"
                      class="btn btn-borderless-dark justify-content-left btn-sm w-100"
                    >
                      <span>{{ act.title }}</span>
                    </router-link>
                    <button
                      v-else
                      class="btn btn-borderless-dark justify-content-left btn-sm w-100"
                      @click="actionClicked(act, item, ix, close)"
                      @click.middle="actionClicked(act, item, ix, close, true)"
                    >
                      <span>{{ act.title }}</span>
                    </button>
                  </div>
                </template>
              </template>
            </FormDropdown>
          </div>
        </td>
      </tr>
      <tr v-if="!values?.length">
        <td colspan="5" class="text-center">
          <div class="text-muted">{{ noDataMessage }}</div>
        </td>
      </tr>
    </tbody>
    <tfoot>
      <tr v-if="$slots.footer">
        <slot name="footer" />
      </tr>
    </tfoot>
  </table>
</template>

<script>
/**
 * Properties format
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
 * - callback: function(item) / return string to display in cell
 * - slot: string / will create a slot to overwrite cell
 *
 * # ACTIONS
 * - callback
 * - title
 * - hideWhenFn // filter function to hide
 * - to: function(item) / item will be passed as parameter. must return a vuerouter link
 */
import FormDropdown from '@/components/Form/FormDropdown.vue'
import { parseToString, parseToLocale } from '@/utils/date'

export default {
  props: {
    headers: {
      type: Array,
      default: () => []
    },
    actions: {
      type: Array,
      default: () => []
    },
    values: {
      type: Array,
      default: () => []
    },
    noDataMessage: {
      type: String,
      default: 'No data to show'
    },
    checkeable: Boolean
  },
  components: {
    FormDropdown
  },
  data: () => ({
    checkAll: false
  }),
  watch: {
    checkAll: {
      handler(val) {
        this.values.forEach((x) => {
          x.checked = val
        })
        this.$emit('checkAll', val)
      }
    }
  },
  methods: {
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

      if (head.dateFormat === true && result !== '-') result = parseToString(result)
      else if (head.dateTimeFormat === true && result !== '-') result = parseToString(result, true)
      else if (head.dateLocaleFormat === true && result !== '-') result = parseToLocale(result)
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

      return result || '-'
    },

    actionClicked(action, item, index, close, middleBtn = false) {
      this.$emit(action.callback, item, index, middleBtn)
      close()
    }
  }
}
</script>

<style></style>
