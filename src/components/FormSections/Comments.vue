<template>
  <h6 class="mb-4">Comments</h6>

  <div class="comments">
    <FormComment @onSave="onSave" />

    <CommentsListItem
      v-for="(c, ci) of comments"
      :key="ci"
      :comment="c"
      @onSave="onSave($event, ci)"
      @onDelete="onDelete(ci)"
      :createAttachmentAction="createAttachmentAction"
      :deleteAttachmentAction="deleteAttachmentAction"
    />
  </div>
</template>

<script>
import FormComment from '../Form/FormComment.vue'
import CommentsListItem from './CommentsListItem.vue'

export default {
  components: {
    FormComment,
    CommentsListItem
  },
  props: {
    modelValue: {
      type: Array,
      default: () => []
    },
    createAction: Function,
    updateAction: Function,
    deleteAction: Function,
    createAttachmentAction: Function,
    deleteAttachmentAction: Function
  },
  computed: {
    comments: {
      get() {
        return [...this.modelValue].sort((a, b) => (a.created_at < b.created_at ? 1 : -1))
      },
      set(val) {
        this.$emit('update:modelValue', val)
      }
    }
  },
  methods: {
    async onDelete(index) {
      if (this.deleteAction) await this.deleteAction(this.comments[index])
      this.comments = this.comments.filter((_, i) => i !== index)
    },

    async onSave(form, index) {
      console.log({
        form,
        index
      })
      if (index !== undefined) {
        if (this.updateAction) {
          const comment = await this.updateAction({
            comment_id: this.comments[index].comment_id,
            form: {
              // remove any other fields
              description: form.description
            }
          })
          const aux = [...this.comments]
          aux[index] = comment
          this.comments = aux
        } else {
          const aux = [...this.comments]
          aux[index] = form
          this.comments = aux
        }
      } else {
        form.created_at = new Date().toISOString()

        if (this.createAction) {
          const comment = await this.createAction(form)

          this.comments = [...this.comments, comment]
        } else {
          this.comments = [...this.comments, form]
        }
      }
    }
  }
}
</script>
