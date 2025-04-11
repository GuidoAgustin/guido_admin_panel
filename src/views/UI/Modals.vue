<template>
  <Widget>
    <template #title>Vue Modals</template>

    <div class="row">
      <div class="col">
        <button
          class="btn btn-primary btn-block"
          @click="
            () => {
              showModal = true
              size = 'sm'
            }
          "
        >
          Open Modal Small
        </button>
      </div>
      <div class="col">
        <button
          class="btn btn-primary btn-block"
          @click="
            () => {
              showModal = true
              size = 'md'
            }
          "
        >
          Open Modal Medium
        </button>
      </div>
      <div class="col">
        <button
          class="btn btn-primary btn-block"
          @click="
            () => {
              showModal = true
              size = 'lg'
            }
          "
        >
          Open Modal Large
        </button>
      </div>
    </div>
  </Widget>

  <vue-modal @close="close" ref="modal" :size="size" v-if="showModal">
    <template #title>Modal Example</template>
    <template #body>
      Lorem ipsum dolor sit amet consectetur adipisicing elit. Sit unde odit, facilis non ipsum iure
      distinctio, deleniti odio commodi voluptatum omnis, natus culpa ad amet pariatur laboriosam.
      Omnis, nostrum. Sapiente.
    </template>
    <template #footer>
      <button class="btn btn-success">Save</button>
    </template>
  </vue-modal>
</template>

<script>
import Widget from '@/components/Widget.vue'

export default {
  components: {
    Widget
  },
  data: () => ({
    showModal: false,
    size: 'sm'
  }),
  methods: {
    close() {
      this.showModal = false
    }
  }
}
</script>

<style></style>
