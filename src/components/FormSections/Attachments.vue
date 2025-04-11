<template>
  <div
    class="d-flex align-items-start"
    :class="{
      'justify-content-between': !paginable,
      'justify-content-end': paginable,
      'gap-1': paginable
    }"
  >
    <h6 v-if="!paginable">Attachments</h6>

    <FormButton small icon="fa fa-plus" @click="$emit('addDocument')" v-if="paginable">
      Add document
    </FormButton>

    <FormUploader resetOnSelect @onChange="onSelectFile">
      <template #default="{ launchPicker }">
        <FormButton small icon="fa fa-plus" @click="launchPicker" v-if="paginable">
          Add attachment
        </FormButton>
        <a class="small" href="#" @click="launchPicker" v-else>
          <i class="fa fa-plus"></i>
          Add attachment
        </a>
      </template>
    </FormUploader>
  </div>

  <vue-table
    ref="vTable"
    v-if="paginable"
    :values="paginatedData"
    :headers="headers"
    :actions="actions"
    @changed="getData"
    @onDelete="onDelete"
    class="mt-2"
  >
    <template #title="{ item }">
      <a href="#" @click.stop="openAttachment(item)" class="link-dark link-underlined">
        {{ item.name || item.file.name }}
      </a>
    </template>
    <template #size="{ item }">
      {{ humanReadableSize(item.file?.size || item.size) }}
    </template>
  </vue-table>
  <VueTableStatic
    :headers="headers"
    :actions="actions"
    :values="attachments"
    @onDelete="onDelete"
    v-else-if="attachments.length"
  >
    <template #title="{ item }">
      <a href="#" @click.stop="openAttachment(item)" class="link-dark link-underlined">
        {{ item.name || item.file.name }}
      </a>
    </template>
    <template #size="{ item }">
      {{ humanReadableSize(item.file?.size || item.size) }}
    </template>
  </VueTableStatic>
</template>

<script>
import FormUploader from '@/components/Form/FormUploader.vue'
import { humanReadableSize } from '@/utils/string'
import VueTableStatic from '@/components/Tables/VueTableStatic.vue'
import downloadFile from '@/utils/downloadFile'
import FormButton from '@/components/Form/FormButton.vue'
import openFile from '@/utils/openFile'

export default {
  emits: ['getData', 'update:modelValue', 'addDocument'],
  components: { FormUploader, VueTableStatic, FormButton },
  props: {
    modelValue: {
      type: Array,
      default: () => []
    },
    paginatedData: Object,
    paginable: Boolean,
    createAction: Function,
    deleteAction: Function,
    getUrlAction: Function,
  },
  computed: {
    attachments: {
      get() {
        return this.modelValue
      },
      set(val) {
        this.$emit('update:modelValue', val)
      }
    }
  },
  data: () => ({
    headers: [
      {
        title: 'file',
        mask: 'Title',
        slot: 'title'
      },
      {
        title: 'file',
        slot: 'size',
        mask: 'Size'
      }
    ],
    actions: [
      {
        callback: 'onDelete',
        title: 'Delete file'
      }
    ]
  }),
  methods: {
    humanReadableSize,
    initTable() {
      this.$refs.vTable.init()
    },
    getData(params) {
      this.$emit('getData', params)
    },
    async onDelete(item, index) {
      if (this.deleteAction) await this.deleteAction(item)

      if (this.paginable) return

      this.attachments.splice(index, 1)
    },
    async onSelectFile(file) {
      if (this.createAction) {
        const attachment = await this.createAction(file)
        if (this.paginable) return

        this.attachments.push(attachment)
      } else {
        this.attachments.push(file)
      }
    },
    openAttachment(item) {
      if (item.file) {
        downloadFile(item.file, item.file.name)
      } else if (item.file_id) {
        this.getUrlAction(item.file_id).then((url) => openFile(url))
      }
    }
  }
}
</script>
