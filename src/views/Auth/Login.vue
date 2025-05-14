<template>
  <FormText label="Email" icon="fa-solid fa-envelope" v-model="form.email" />
  <FormText
    label="Password"
    password
    icon="fa-solid fa-fingerprint"
    v-model="form.password"
    @keyup.enter="signIn"
  />
  <FormSwitch label="Remember me" v-model="form.remember" small />

  <button class="btn btn-primary btn-block mt-4" @click="signIn">Log In</button>

  <router-link class="small text-center d-block mt-2" :to="{ name: 'forgotPassword' }">
    Forgot your password?
  </router-link>

  <button class="btn btn-secondary btn-block mt-2" @click="goToRegister">
    Crear cuenta
  </button>
</template>

<script>
import FormText from '@/components/Form/FormText.vue'
import FormSwitch from '@/components/Form/FormSwitch.vue'

export default {
  components: {
    FormText,
    FormSwitch
  },
  data: () => ({
    form: {
      email: null,
      password: null,
      remember: true
    }
  }),
  beforeMount() {
    const default_email = localStorage.getItem('default_email')
    const default_pw = localStorage.getItem('default_pw')
    if (default_email) this.form.email = default_email
    if (default_pw) this.form.password = default_pw
  },
  methods: {
    signIn() {
      this.$store.dispatch('login', this.form).then(() => {
        this.$router.push('/home')
      })
    },
    goToRegister() {
      this.$router.push({ name: 'register' })
    }
  }
}
</script>