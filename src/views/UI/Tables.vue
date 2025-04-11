<template>
  <Widget>
    <template #title>Vue Tables</template>
    <vue-table
      v-if="vTable.headers"
      :values="vTable.values"
      :headers="vTable.headers"
      :actions="vTable.actions"
      :options="vTable.options"
      :filters="vTable.filters"
      @changed="getData"
      ref="vtable"
      @onShowDetails="onShowDetails"
    />
  </Widget>
</template>

<script>
import Widget from '@/components/Widget.vue'
import axios from 'axios'
export default {
  components: {
    Widget
  },
  data: () => ({
    vTable: {
      filters: [
        {
          title: 'Status',
          type: 'select-multiple',
          options: [
            'Waiting for approval',
            'Pre enrolled',
            'Enrolled',
            'Completed',
            'Cancelled',
            'Void'
          ],
          column: 'status'
        },
        {
          title: 'Status Simple',
          type: 'select',
          options: [
            'Waiting for approval',
            'Pre enrolled',
            'Enrolled',
            'Completed',
            'Cancelled',
            'Void'
          ],
          column: 'status_simple'
        },
        {
          title: 'Responsible',
          type: 'combobox',
          column: 'agent_id',
          module: 'users' // Combobox from combos-modules.js
        },
        {
          title: 'Start Date',
          type: 'date',
          column: 'start_date'
        },
        {
          title: 'Start Date (range)',
          type: 'date-range',
          column: 'start_date_range'
        }
      ],
      headers: [
        {
          title: 'name',
          mask: 'Nombre',
          sortable: true,
          hideable: true
        },
        {
          title: 'username',
          sortable: true,
          hideable: true
        },
        {
          title: 'role.role.role.role.name',
          mask: 'role',
          sortable: true,
          hideable: true
        }
      ],
      actions: [
        {
          title: 'Show Details',
          callback: 'onShowDetails'
        },
        {
          title: 'Delete item',
          callback: 'onDelete'
        }
      ],
      values: {
        total: 3,
        per_page: 15,
        current_page: 1,
        last_page: 1,
        from: 1,
        to: 15,
        data: [
          {
            id: 1,
            name: 'Pedro Aznar',
            username: 'paznar',
            role: {
              name: 'Admin'
            }
          },
          {
            id: 2,
            name: 'Charlie Alberti',
            username: 'chalberti',
            role: {
              name: 'Manager',
              role: {
                name: 'Manager',
                role: {
                  name: 'Manager',
                  role: {
                    name: 'Manager',
                    role: {
                      name: 'Manager'
                    }
                  }
                }
              }
            }
          },
          {
            id: 3,
            name: 'Gustavo Cerati',
            username: 'gcerati',
            role: {
              name: 'Admin'
            }
          }
        ]
      },
      options: {
        /// Go to OPTIONS SECTION for explanation
      }
    }
  }),
  methods: {
    getData(params) {
      axios.get('http://localhost:5010/test', {
        params
      })
    },
    onShowDetails(item, index) {
      console.log({ item, index })
    }
  }
}
</script>

<style></style>
