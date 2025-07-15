<template>
  <div class="dashboard-layout">
    <Sidebar />
    <div class="main">
      <Topbar />
      <div class="content-wrapper">
        <div class="content">
          <div class="admin-ticketing-theme">
            <router-view></router-view>
          </div>
        </div>
        <div class="footer">
          Copyright &reg; {{ new Date().getFullYear() }} - QUARTZ CRM - Powered by
          <a href="http://farenasoft.com" target="_blank">&nbsp;Farenasoft</a>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// El script no necesita cambios
import Sidebar from '@/components/Sidebar.vue'
import Topbar from '@/components/Topbar.vue'
export default {
  components: {
    Sidebar,
    Topbar
  },
  beforeMount() {
    this.$store.dispatch('setCredentials')
    const isLoggedIn = this.$store.getters.isLoggedIn
    if (!isLoggedIn) {
      this.$router.push('/login')
    } else {
      // this.$store.dispatch("getUnreadNotifications");
    }
  }
}
</script>

<style lang="scss">
  /*
    Aquí importamos el nuevo archivo de tema.
    Este archivo solo afectará a los elementos dentro de .admin-ticketing-theme
    y no entrará en conflicto con los estilos de _main.scss.
  */
  @import '@/assets/scss/_adminPanel.scss';
</style>