<template>
  <div class="d-flex align-items-center justify-content-center h-100">
    <div class="card mx-4">
      <div class="card-header text-center">
        <img src="/img/logo.svg" alt="Logo" class="brand-logo my-3" />
        <h3 class="m-0">QUARTZ</h3>
        <small>Admin Panel</small>
      </div>
      <div class="card-body px-4 pb-4">
        <router-view></router-view>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  mounted() {
    const isLoggedIn = this.$store.getters.isLoggedIn
    if (isLoggedIn) {
      this.$router.push('/dashboard')
    } else {
      this.$router.push('/login')
    }
}
}
</script>
