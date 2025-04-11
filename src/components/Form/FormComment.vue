<template>
  <div class="form-comment">
    <div class="form-wrapper" ref="wrapper">
      <div class="user-avatar">{{ userAvatar }}</div>

      <FormText placeholder="Write a comment..." v-if="!active" @click="activateForm" />
      <div v-else>
        <FormHtml placeholder="Write a comment" v-model="form.description" ref="htmlInput" />

        <div class="form-comment-actions">
          <FormUploader resetOnSelect @onChange="onSelectFile">
            <template #default="{ launchPicker }">
              <FormButton
                small
                theme="borderless-dark"
                tooltip="Attach file"
                :tooltipContainer="$refs.wrapper"
                icon="fa-solid fa-paperclip"
                @click="launchPicker"
                v-model="form.attachments"
              />
            </template>
          </FormUploader>

          <div>
            <FormButton small theme="medium" class="mr-1" @click="deactivateForm">
              Cancel
            </FormButton>
            <FormButton small @click="saveForm"> Confirm </FormButton>
          </div>
        </div>

        <ul class="form-comment-attachments" v-if="form.attachments.length">
          <li v-for="(a, ai) of form.attachments" :key="ai">
            <div class="badge badge-medium">
              <span>
                {{ a.file?.name || a.name }} ({{ humanReadableSize(a.file?.size || a.size) }})
              </span>
              <span class="material-symbols-outlined" @click="removeAttachment(ai)"> close </span>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import { humanReadableSize } from '@/utils/string'
import FormButton from './FormButton.vue'
import FormHtml from './FormHtml.vue'
import FormText from './FormText.vue'
import FormUploader from './FormUploader.vue'

export default {
  components: {
    FormText,
    FormHtml,
    FormUploader,
    FormButton
  },
  props: {
    modelValue: {
      type: Object,
      validator: (value) => {
        if (!value) return true
        if (!Object.keys(value).includes('description', 'attachments')) return false
        if (!Array.isArray(value.attachments)) return false

        return true
      }
    },
    startOpen: Boolean,
    createAttachmentAction: Function,
    deleteAttachmentAction: Function
  },
  computed: {
    userAvatar() {
      if (!this.$store.getters.user) return

      const { first_name, last_name } = this.$store.getters.user
      return `${first_name[0]}${last_name[0]}`.toUpperCase()
    }
  },
  data: () => ({
    active: false,
    form: {
      description: '',
      attachments: [],
      user: null,
      user_id: null
    }
  }),
  mounted() {
    if (this.modelValue) {
      this.form.description = this.modelValue.description || ''
      this.form.attachments = this.modelValue.attachments
      this.form.user = this.modelValue.user
      this.form.user_id = this.modelValue.user_id
    } else {
      this.form.user = this.$store?.getters?.user
      this.form.user_id = this.$store?.getters?.user?.user_id
    }

    if (this.startOpen) {
      this.activateForm()
    }
  },
  methods: {
    humanReadableSize,
    activateForm() {
      this.active = true
      setTimeout(() => {
        this.$refs.htmlInput.focus()
        this.updateScrollPosition()
      }, 100)
    },
    deactivateForm() {
      if (this.modelValue) {
        this.$emit('onCancel')
      } else {
        this.resetForm()
      }
    },
    resetForm() {
      this.form = {
        description: '',
        attachments: [],
        user: this.$store?.getters?.user,
        user_id: this.$store?.getters?.user?.user_id
      }
      this.active = false
    },
    saveForm() {
      this.active = false
      this.$emit('onSave', this.form)
      this.resetForm()
    },
    async onSelectFile(file) {
      if (this.createAttachmentAction)
        await this.createAttachmentAction(this.modelValue.comment_id, file.file)
      this.form.attachments.push(file)
    },
    async removeAttachment(ai) {
      if (this.deleteAttachmentAction) await this.deleteAttachmentAction(this.form.attachments[ai])
      this.form.attachments.splice(ai, 1)
    },
    getClosestScrollableElement(element) {
      while (element) {
        const style = window.getComputedStyle(element)
        if (
          style.overflow === 'auto' ||
          style.overflow === 'scroll' ||
          style.overflowY === 'auto' ||
          style.overflowY === 'scroll'
        ) {
          return element
        }
        element = element.parentElement
      }
      return document.body
    },
    updateScrollPosition() {
      const element = this.$el.parentNode
      const container = this.getClosestScrollableElement(element)

      if (!container) return

      const containerRect = container.getBoundingClientRect()
      const elementRect = element.getBoundingClientRect()

      const isFullyVisible =
        elementRect.top >= containerRect.top && elementRect.bottom <= containerRect.bottom

      if (!isFullyVisible) {
        const scrollTop = container.scrollTop

        if (elementRect.top < containerRect.top) {
          container.scrollTop = scrollTop + (elementRect.top - containerRect.top) + 10
        } else if (elementRect.bottom > containerRect.bottom) {
          container.scrollTop = scrollTop + (elementRect.bottom - containerRect.bottom) + 10
        }
      }
    }
  }
}
</script>

<style></style>
