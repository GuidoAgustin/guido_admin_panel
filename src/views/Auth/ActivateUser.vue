<template>
  <FormText label="Password" password icon="fa-solid fa-fingerprint" v-model="form.password" />
  <FormText
    label="Password Confirmation"
    password
    icon="fa-solid fa-fingerprint"
    v-model="form.password_confirmation"
    @keyup.enter="createPassword"
  />

  <button class="btn btn-primary btn-block" @click="createPassword">Create Password</button>

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
    createPassword() {
      this.$store.dispatch('verifyUser', this.form).then(() => {
        this.$toast.success('User verified. You can now sign in')
        this.$router.push({ name: 'login' })
      })
    }
  }
}
</script>
