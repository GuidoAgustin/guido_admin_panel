<template>
  <div class="topbar">
    <div class="welcome-message">
      Bienvenido
      <span v-if="$store.getters.isLoggedIn && $store.getters.user">
        {{ $store.getters.user.first_name }}!
      </span>!
    </div>
    <ul class="topbar-buttons">
      <li v-if="$store.getters.isAdmin" @click="goToAdminPanel" title="Panel de administración">
        <i class="fa-solid fa-tools"></i>
      </li>
      <li @click="handleLogoutOrLogin">
        <i class="fa-solid fa-power-off"></i>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  mounted() {
    document.addEventListener('click', this.closeSidebar)
  },
  beforeUnmount() {
    document.removeEventListener('click', this.closeSidebar)
  },
  methods: {
    closeSidebar(e) {
      const sb = document.querySelector('.sidebar')
      if (sb && sb.classList.contains('sidebar-open')) {
        if (e.target.closest('.sidebar')) return
        sb.classList.remove('sidebar-open')
      }
    },
    openSidebar() {
      const sb = document.querySelector('.sidebar')
      if (sb)
        sb.classList.add('sidebar-open')
    },
    async handleLogoutOrLogin() {
      if (this.$store.getters.isLoggedIn) {
        await this.$store.dispatch('logout', { redirect: false })
        // El usuario se desloguea y permanece en la página actual
      } else {
        this.$router.push({ name: 'login' })
      }
    },
    goToAdminPanel() {
      this.$router.push({ path: '/adminpanel' }) // Asegúrate de tener esta ruta definida
    }
  }
}
</script>