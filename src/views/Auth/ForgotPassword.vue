<template>
  <div>
    <h4 class="text-center mb-4">Recuperar Contraseña</h4>
    <p class="text-muted text-center small mb-4">
      Ingresá tu correo electrónico y te enviaremos las instrucciones para restablecer tu contraseña.
    </p>

    <FormText
      label="Email"
      icon="fa-solid fa-envelope"
      v-model="form.email"
      placeholder="tu@email.com"
      @keyup.enter="resetPassword"
    />

    <button class="btn btn-primary btn-block mt-3" @click="resetPassword" :disabled="loading">
      <i class="fa fa-spinner fa-spin mr-2" v-if="loading"></i>
      Enviar Instrucciones
    </button>

    <router-link class="small text-center d-block mt-3 text-secondary" :to="{ name: 'login' }">
      <i class="fa fa-arrow-left mr-1"></i> Volver al Login
    </router-link>
  </div>
</template>

<script>
import FormText from '@/components/Form/FormText.vue'

export default {
  components: {
    FormText
  },
  data: () => ({
    form: {
      email: null
    },
    loading: false
  }),
  methods: {
    async resetPassword() {
      if (!this.form.email) {
        this.$toast.error('Por favor, ingresá tu correo electrónico')
        return
      }

      this.loading = true;
      try {
        // Dispara la acción de Vuex (asegurate de que en store/index.js o auth.js exista esta acción apuntando a /forgot_password)
        await this.$store.dispatch('forgotPassword', this.form)
        this.$toast.success('Correo enviado. ¡Revisá tu bandeja de entrada!')
        this.form.email = null; // Limpiamos el input
      } catch (error) {
        const msg = error.response?.data?.data || error.response?.data?.message || 'Error al enviar el correo';
        this.$toast.error(msg);
      } finally {
        this.loading = false;
      }
    }
  }
}
</script>