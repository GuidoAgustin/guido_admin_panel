<template>
  <FormText label="Password" password icon="fa-solid fa-fingerprint" v-model="form.password" />
  <FormText
    label="Password Confirmation"
    password
    icon="fa-solid fa-fingerprint"
    v-model="form.password_confirmation"
    @keyup.enter="resetPassword"
  />

  <button class="btn btn-primary btn-block" @click="resetPassword">Reset Password</button>

  <router-link class="small text-center d-block mt-2" :to="{ name: 'login' }">
    Back to Login
  </router-link>
</template>

<script>
import FormText from '@/components/Form/FormText.vue'

export default {
  components: {
    FormText
  },
  data: () => ({
    form: {
      token: null,
      password: null,
      password_confirmation: null
    }
  }),
  mounted() {
    this.form.token = this.$route.params.token
  },
  methods: {
    resetPassword() {
      this.$store.dispatch('resetPassword', this.form).then(() => {
        this.$toast.success('Password updated. You can now sign in')
        this.$router.push({ name: 'login' })
      })
    }
  }
}
</script>
