<template>
  <div class="row">
    <div class="col">
      <Widget>
        <Tabs :tabs="tabs" @change="onTabChange">
          <template #header> <h4>TABS HEADER</h4> </template>
          <template #tabs-pane-1>
            <TabsPane1 :form="form" />
          </template>
          <template #tabs-pane-2>
            <TabsPane2 :form="form" />
          </template>
          <template #tabs-pane-3> Pane 3 </template>
          <template #tabs-pane-4> Pane 4 </template>
          <template #tabs-pane-5> Pane 5 </template>
        </Tabs>
      </Widget>

      {{ form }}
    </div>
  </div>
</template>

<script>
import Widget from '@/components/Widget.vue'
import Tabs from '@/components/Tabs/Tabs.vue'
import TabsPane1 from './TabsPane1.vue'
import TabsPane2 from './TabsPane2.vue'

export default {
  components: {
    Widget,
    Tabs,
    TabsPane1,
    TabsPane2
  },
  data: () => ({
    tabs: [
      { title: 'Bookings', icon: 'fa fa-home' },
      { title: 'Properties', icon: 'fa fa-gears' },
      'Landlords',
      'Rooms',
      'Beds'
    ],
    form: {}
  }),
  methods: {
    onTabChange(tab) {
      console.log('tab has changed', tab)
    }
  }
}
</script>
