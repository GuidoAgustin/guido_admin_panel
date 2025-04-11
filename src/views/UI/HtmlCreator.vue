<template>
  <Widget>
    <template #title>Html Creator</template>

    <div class="d-flex py-4 align-items-center gap-2">
      <b>Select a format:</b>
      <FormButton
        v-for="f of formats"
        :key="f"
        @click="selFormat = f"
        :theme="f !== selFormat ? 'none' : 'primary'"
        >{{ f.toUpperCase() }}</FormButton
      >
    </div>

    <HtmlEditor
      v-model="emailData"
      :templates="templates"
      @saveTemplate="saveTemplate"
      @deleteTemplate="deleteTemplate"
      :format="selFormat"
    />
  </Widget>

  <pre>{{ emailData }}</pre>
</template>

<script>
import Widget from '@/components/Widget.vue'
import HtmlEditor from '@/components/HtmlEditor/HtmlEditor.vue'
import FormButton from '@/components/Form/FormButton.vue'

export default {
  components: {
    Widget,
    HtmlEditor,
    FormButton
  },
  data: () => ({
    emailData: [],
    templates: [],
    formats: ['email', 'web', 'A4', 'A5'],
    selFormat: 'email'
  }),
  methods: {
    saveTemplate(template) {
      this.templates.push(template)
    },
    deleteTemplate(templateIx) {
      this.templates.splice(templateIx, 1)
    }
  }
}
</script>

<style></style>
