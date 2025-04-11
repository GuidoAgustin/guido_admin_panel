<template>
  <FormComment
    :modelValue="comment"
    @onSave="onSave"
    @onCancel="editting = false"
    v-if="editting"
    startOpen
    :createAttachmentAction="createAttachmentAction"
    :deleteAttachmentAction="deleteAttachmentAction"
  />

  <div class="comment-item" v-else>
    <div class="user-avatar">{{ userAvatar }}</div>

    <div class="comment-item-wrapper">
      <div class="comment-head">
        <span>{{ comment.user.first_name }} {{ comment.user.last_name }}</span>
        <span>{{ parseToLocale(comment.created_at) || 'now' }}</span>
      </div>
      <div class="comment-content" v-html="comment.description" />
      <ul class="comment-attachments" v-if="comment.attachments.length">
        <li v-for="(a, ai) of comment.attachments" :key="ai">
          <a class="link-medium" @click.stop="openFile(a)">
            {{ a.file?.name || a.name }} ({{ humanReadableSize(a.file?.size || a.size) }})
          </a>
        </li>
      </ul>
      <div class="comment-actions" v-if="comment.user_id === user.user_id">
        <a href="#" @click.stop="editting = true">Edit</a>
        <a href="#" @click.stop="$emit('onDelete')">Delete</a>
      </div>
    </div>
  </div>
</template>

<script>
import { humanReadableSize } from '@/utils/string'
import { parseToLocale } from '@/utils/date'
import FormComment from '../Form/FormComment.vue'
import openFile from '@/utils/openFile'

export default {
  emits: ['onSave', 'onDelete'],
  components: {
    FormComment
  },
  props: {
    comment: {
      type: Object,
      default: () => ({})
    },
    createAttachmentAction: Function,
    deleteAttachmentAction: Function
  },
  data: () => ({
    editting: false
  }),
  computed: {
    user() {
      return this.$store.getters.user
    },
    userAvatar() {
      const { first_name, last_name } = this.comment.user
      return `${first_name[0]}${last_name[0]}`.toUpperCase()
    }
  },
  methods: {
    parseToLocale,
    humanReadableSize,
    onSave($event) {
      this.$emit('onSave', $event)
      this.editting = false
    },
    openFile(file) {
      if (file.file) {
        openFile(URL.createObjectURL(file.file))
      } else if (file.file_id) {
        this.$store.dispatch('getAttachmentUrl', file.file_id).then((url) => openFile(url))
      }
    }
  }
}
</script>

<style></style>
