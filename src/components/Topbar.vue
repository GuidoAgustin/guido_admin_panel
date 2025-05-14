<template>
  <div class="topbar">
    <div class="welcome-message">
      Bienvenido <span v-if="$store.getters.isLoggedIn && $store.getters.user"> {{ $store.getters.user.first_name
        }}!</span>!
    </div>
    <ul class="topbar-buttons">
      <li><i class="fa-solid fa-bell"></i></li>
      <li><i class="fa-solid fa-gear"></i></li>
      <li @click="$store.dispatch('logout')">
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
    }
  }
}
</script>
