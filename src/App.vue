<template>
  <FullPageLoader v-if="$store.getters.loader_active" />
  <router-view :key="$route.fullPath" />

  <div id="modal-container"></div>
</template>

<script>
import FullPageLoader from '@/components/FullPageLoader.vue'

export default {
  components: {
    FullPageLoader
  }
}
</script>
