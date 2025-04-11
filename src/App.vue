<template>
  <FullPageLoader v-if="$store.getters.loader_active" />
  <router-view :key="$route.fullPath" />
  <InactiveModal
    :showModal="showModal"
    :countdownTime="countdownTime"
    @stay-logged-in="stayLoggedIn"
    @logout="logoutUser"
  />
  <div id="modal-container"></div>
</template>

<script>
import FullPageLoader from '@/components/FullPageLoader.vue'
import InactiveModal from '@/components/InactiveModal.vue'
import createInactivityTracker from '@/utils/inactivityTracker'

export default {
  components: {
    FullPageLoader,
    InactiveModal
  },
  data() {
    return {
      showModal: false,
      countdownTime: 60 * 1000,
      inactivityTimeout: 30 * 60 * 1000
    }
  },
  mounted() {
    this.inactivityTracker = createInactivityTracker({
      inactivityTimeout: this.inactivityTimeout,
      countdownTime: this.countdownTime,
      onLogout: this.logoutUser,
      onShowModal: () => {
        this.showModal = true
      },
      onHideModal: () => {
        this.showModal = false
      }
    })
  },
  methods: {
    stayLoggedIn() {
      this.inactivityTracker.stayLoggedIn()
    },
    logoutUser() {
      this.showModal = false
      this.$store.dispatch('logout')
    }
  },
  beforeUnmount() {
    this.inactivityTracker.clearTimers()
  }
}
</script>
