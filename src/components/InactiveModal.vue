<template>
    <vue-modal size="sm" position="center" v-if="showModal">
      <template #title>Are you still there?</template>
      <template #body>
        <p>Due to inactivity, your session will expire in {{ countdown }} seconds.</p>
      </template>
      <template #footer>
        <FormButton theme="dark"  @click="stayLoggedIn">
            Stay Logged In
        </FormButton>
      </template>
    </vue-modal>
  </template>
  
  <script>
  import FormButton from '@/components/Form/FormButton.vue'

  export default {
    components: {
        FormButton,
    },
    props: {
      showModal: Boolean,
      countdownTime: Number,
    },
    emits: ['stay-logged-in', 'logout'],
    data() {
      return {
        countdown: Math.floor(this.countdownTime / 1000),
        countdownInterval: null,
      }
    },
    watch: {
      showModal(newVal) {
        if (newVal) {
          this.startCountdown()
        }
        else {
          this.stopCountdown()
        }
      },
    },
    methods: {
      startCountdown() {
        this.countdown = Math.floor(this.countdownTime / 1000)
        this.countdownInterval = setInterval(() => {
          if (this.countdown > 0) {
            this.countdown--
          } else {
            this.logoutUser()
          }
        }, 1000)
      },
      stopCountdown() {
        clearInterval(this.countdownInterval)
        this.countdownInterval = null
      },
      stayLoggedIn() {
        this.stopCountdown()
        this.$emit('stay-logged-in')
      },
      logoutUser() {
        this.stopCountdown()
        this.$emit('logout')
      },
    },
  }
  </script>