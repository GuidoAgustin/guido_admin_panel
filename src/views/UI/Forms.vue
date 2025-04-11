<template>
  <div class="row">
    <div class="col-md-4">
      <Widget>
        <template #title>Form Text</template>

        <FormText v-model="text" label="Texto" icon="fa-solid fa-equals" />
        <FormText v-model="text" label="Texto no icon" />
        <FormText v-model="text" label="Texto no icon" maxChars="25" />
        <FormText v-model="text" label="Texto **disabled**" disabled icon="fa-solid fa-equals" />
        <p>Texto: {{ text }}</p>
      </Widget>
    </div>
    <div class="col-md-4">
      <Widget>
        <template #title>Form Html</template>

        <FormHtml v-model="html" label="Html" />
        <FormHtml v-model="html" label="Html **disabled**" disabled />
        <p>Html: {{ html }}</p>
      </Widget>
    </div>
    <div class="col-md-4">
      <Widget>
        <template #title>Form Code</template>

        <FormCode v-model="code" label="Code" />
        <FormCode v-model="code" label="Code **disabled**" disabled />
        <p>Code: {{ code }}</p>
      </Widget>
    </div>
    <div class="col-md-4">
      <Widget>
        <template #title>Form Number</template>

        <FormNumber v-model="number" label="Telefono" icon="fa-solid fa-phone" />
        <FormNumber
          v-model="number"
          label="Telefono **disabled**"
          disabled
          icon="fa-solid fa-phone"
        />
        <p>Numero: {{ number }}</p>
      </Widget>
    </div>
    <div class="col-md-4">
      <Widget>
        <template #title>Form Combobox</template>

        <div class="d-grid grid-2-cols">
          <label>Combo in modal</label>

          <UsersCombobox v-model="selectedUser" label="Users combo keep open" inModal />
        </div>
        <UsersCombobox v-model="selectedUser" label="Users combo keep open" keep-open />
        <UsersCombobox v-model="selectedUser" label="Users combo no icon" />
        <UsersCombobox v-model="selectedUser" label="Users combo disabled" disabled />
        <UsersCombobox v-model="selectedUser" label="Users combo" icon="fa fa-users" />
        <UsersCombobox v-model="selectedUser" label="Users combo 2" icon="fa fa-users" flex-field />

        <p>Value: {{ selectedUser }}</p>
      </Widget>
    </div>
    <div class="col-md-4">
      <Widget>
        <template #title>Form Select</template>

        <FormSelect v-model="selOpt" label="Opciones" :options="options" icon="fa-solid fa-phone" />
        <FormSelect v-model="selOpt" label="Opciones no icon" :options="options" />
        <FormSelect
          v-model="selOpt"
          label="Opciones **disabled**"
          disabled
          :options="options"
          icon="fa-solid fa-phone"
        />
        <p>Sel Opt: {{ selOpt }}</p>
      </Widget>
    </div>
    <div class="col-md-4">
      <Widget>
        <template #title>Form Uploader</template>

        <FormUploader @onChange="selFile = $event" label="Archivo" :maxSizeMB="2" />
        <FormUploader @onChange="selFile = $event" label="Archivo flex" flexField />
        <FormUploader disabled @onChange="selFile = $event" label="Archivo **disabled**" />
        <img
          :src="selFile?.url || 'http://via.placeholder.com/300'"
          alt=""
          style="max-width: 100%; max-height: 250px; margin: 1em auto 0em; display: block"
        />
      </Widget>
    </div>
    <div class="col-md-4">
      <Widget class="mb-4">
        <template #title>Form Date</template>

        <FormDate v-model="date" label="Date" />
        <FormDate v-model="date" disabled label="Date **disabled**" />
        <p>Date: {{ date }}</p>
      </Widget>
      <Widget>
        <template #title>Form Date Range</template>

        <FormDateRange v-model="dateRange" label="Date" :custom-ranges="customDateRanges" />
        <FormDateRange
          v-model="dateRange"
          label="Date"
          flex-field
          :custom-ranges="customDateRanges"
        />
        <FormDateRange v-model="dateRange" disabled label="Date **disabled**" />
        <p>Date: {{ date }}</p>
      </Widget>
    </div>
    <div class="col-md-4">
      <Widget>
        <template #title>Form Switch</template>

        <FormSwitch v-model="switched" label="Boolean" />
        <FormSwitch v-model="switched" label="Boolean small" small />
        <FormSwitch v-model="switched" disabled label="Boolean **disabled**" />
        <p>Value: {{ switched }}</p>
      </Widget>
    </div>
    <div class="col-md-4">
      <Widget>
        <template #title>Form Buttons</template>

        <div class="d-grid grid-2-cols mb-4">
          <div>
            <h6>Plain</h6>
            <FormButton>Button Primary</FormButton>
            <FormButton theme="secondary">Button Secondary</FormButton>
            <FormButton theme="white">Button White</FormButton>
            <FormButton theme="medium">Button Medium</FormButton>
            <FormButton theme="dark">Button Dark</FormButton>
            <FormButton theme="light">Button Light</FormButton>
            <FormButton theme="danger">Button Danger</FormButton>
            <FormButton theme="success">Button Success</FormButton>
            <FormButton theme="info">Button Info</FormButton>
            <FormButton theme="warning">Button Warning</FormButton>
          </div>
          <div>
            <h6>Outlined</h6>

            <FormButton outlined>Button Primary</FormButton>
            <FormButton outlined theme="secondary">Button Secondary</FormButton>
            <FormButton outlined theme="medium">Button Medium</FormButton>
            <FormButton outlined theme="dark">Button Dark</FormButton>
            <FormButton outlined theme="danger">Button Danger</FormButton>
            <FormButton outlined theme="success">Button Success</FormButton>
            <FormButton outlined theme="info">Button Info</FormButton>
            <FormButton outlined theme="warning">Button Warning</FormButton>
          </div>
        </div>

        <div class="d-grid grid-2-cols">
          <div>
            <h6>Small</h6>

            <FormButton small>Button Primary</FormButton>
            <FormButton small theme="secondary">Button Secondary</FormButton>
            <FormButton small theme="medium">Button Medium</FormButton>
            <FormButton small theme="dark">Button Dark</FormButton>
            <FormButton small theme="danger">Button Danger</FormButton>
            <FormButton small theme="success">Button Success</FormButton>
            <FormButton small theme="info">Button Info</FormButton>
            <FormButton small theme="warning">Button Warning</FormButton>
          </div>

          <div>
            <h6>Block</h6>

            <FormButton block>Button Primary</FormButton>
            <FormButton block theme="secondary">Button Secondary</FormButton>
            <FormButton block theme="medium">Button Medium</FormButton>
            <FormButton block theme="dark">Button Dark</FormButton>
            <FormButton block theme="danger">Button Danger</FormButton>
            <FormButton block theme="success">Button Success</FormButton>
            <FormButton block theme="info">Button Info</FormButton>
            <FormButton block theme="warning">Button Warning</FormButton>
          </div>
        </div>

        <hr />
        <h6>Icons</h6>

        <FormButton just-icon>
          <i class="fa fa-users"></i>
        </FormButton>

        <FormButton just-icon theme="secondary">
          <i class="fa fa-gears"></i>
        </FormButton>

        <FormButton just-icon theme="danger">
          <i class="fa fa-house"></i>
        </FormButton>
      </Widget>
    </div>
    <div class="col-md-4">
      <Widget>
        <template #title>Form Link Buttons</template>

        <FormButton to="/">Button Primary</FormButton>
        <FormButton block to="/">Button Primary</FormButton>
        <FormButton outlined to="/">Button Primary</FormButton>
        <FormButton small to="/">Button Primary</FormButton>
      </Widget>
    </div>
  </div>
</template>

<script>
import Widget from '@/components/Widget.vue'
import FormText from '@/components/Form/FormText.vue'
import FormHtml from '@/components/Form/FormHtml.vue'
import FormNumber from '@/components/Form/FormNumber.vue'
import FormSelect from '@/components/Form/FormSelect.vue'
import FormUploader from '@/components/Form/FormUploader.vue'
import FormDate from '@/components/Form/FormDate.vue'
import FormDateRange from '@/components/Form/FormDateRange.vue'
import FormSwitch from '@/components/Form/FormSwitch.vue'
import FormButton from '@/components/Form/FormButton.vue'
import FormCode from '@/components/Form/FormCode.vue'
import UsersCombobox from '@/components/Comboboxes/UsersCombobox.vue'
import code from './html'

export default {
  components: {
    Widget,
    FormText,
    FormHtml,
    FormNumber,
    FormSelect,
    FormUploader,
    FormDate,
    FormSwitch,
    FormCode,
    UsersCombobox,
    FormDateRange,
    FormButton
  },
  data: () => ({
    number: null,
    html: '',
    code,
    text: null,
    selOpt: null,
    selFile: null,
    date: null,
    dateRange: { start: null, end: null },
    customDateRanges: [
      { label: '1 month', qty: 1, unit: 'month' },
      { label: '3 months', qty: 3, unit: 'month' },
      { label: '6 months', qty: 6, unit: 'month' }
    ],
    switched: false,
    options: [
      {
        value: 1,
        name: 'Opt 1'
      },
      {
        value: 2,
        name: 'Opt 2'
      }
    ],
    selectedUser: { value: 1, label: 'John Smith' }
  })
}
</script>
