<template>
    <footer class="site-footer bg-dark text-white py-4 mt-5">
      <button class="btn btn-back" @click="$router.back()" style="margin: 16px 0 10px 16px;">
          <i class="fas fa-arrow-left"></i> Ir para atrás
        </button>
    <div class="container text-center">
      <h4 class="mb-3">Síguenos la Pista</h4>
      <div class="social-icons mb-3">
        <a href="#" target="_blank" aria-label="Facebook" class="text-white mx-2"><i class="fab fa-facebook-f fa-lg"></i></a>
        <a href="#" target="_blank" aria-label="Instagram" class="text-white mx-2"><i class="fab fa-instagram fa-lg"></i></a>
        <a href="#" target="_blank" aria-label="Pinterest" class="text-white mx-2"><i class="fab fa-pinterest-p fa-lg"></i></a>
        <a href="#" target="_blank" aria-label="TikTok" class="text-white mx-2"><i class="fab fa-tiktok fa-lg"></i></a>
      </div>
      <p class="copyright mb-0 small">
        &copy; {{ currentYear }} TuMarca de Moda. Todos los derechos reservados.
      </p>
    </div>
  </footer>
</template>

<script>
export default {
  name: 'SiteFooter', // Le damos su nombre oficial
  
  computed: {
    // Usamos una propiedad computada para calcular el año automáticamente
    currentYear() {
      return new Date().getFullYear();
    }
  }
}
</script>

<style>
@import '@/assets/scss/_ticketing.scss';
</style>