<template>
  <div class="homepage-container">
    <header class="hero-section" :style="{ backgroundImage: 'url(' + heroBackgroundImage + ')' }">
      <div class="hero-overlay"></div>
      <div class="hero-content container">
        <h1>Viste Tu Historia, Define Tu Estilo</h1>
        <p>
          Descubre las últimas tendencias y piezas atemporales que resaltan tu personalidad.
          Calidad, diseño y la inspiración que buscas, todo en un mismo lugar.
        </p>
      </div>
    </header>

    <main>
      <section class="explanation-section container">
        <h2>Donde la Moda Encuentra su Expresión</h2>
        <div class="explanation-grid">
          <div class="explanation-item">
            <img :src="image1Url" alt="Nuevas Colecciones de Ropa" />
            <h3>Nuevas Colecciones</h3>
            <p>
              Explora los recién llegados. Diseños frescos y vanguardistas que marcan la pauta de la
              temporada.
            </p>
          </div>
          <div class="explanation-item">
            <img :src="image2Url" alt="Looks para toda Ocasión" />
            <h3>Estilos Para Ti</h3>
            <p>
              Encuentra el outfit perfecto para cada momento, desde la comodidad casual hasta la
              elegancia sofisticada.
            </p>
          </div>
          <div class="explanation-item">
            <img :src="image3Url" alt="Calidad y Diseño en Prendas" />
            <h3>Calidad y Diseño Único</h3>
            <p>
              Prendas confeccionadas con atención al detalle y materiales que garantizan confort y
              durabilidad.
            </p>
          </div>
        </div>
      </section>

      <section class="cta-buttons-section">
        <div class="container">
          <button @click="goToProducts" class="btn btn-primary">
            <i class="fas fa-tshirt"></i> Ver Colección
          </button>
          <button @click="getTicket" class="btn btn-secondary">
            <i class="fas fa-star"></i> Novedades y Eventos
          </button>
        </div>
      </section>
    </main>

    <footer class="site-footer">
      <div class="container">
        <h4>Síguenos la Pista</h4>
        <div class="social-icons">
          <a href="#" target="_blank" aria-label="Facebook"><i class="fab fa-facebook-f"></i></a>
          <a href="#" target="_blank" aria-label="Instagram"><i class="fab fa-instagram"></i></a>
          <a href="#" target="_blank" aria-label="Pinterest"><i class="fab fa-pinterest-p"></i></a>
          <a href="#" target="_blank" aria-label="TikTok"><i class="fab fa-tiktok"></i></a>
        </div>
        <p class="copyright">
          &copy; {{ currentYear }} TuMarca de Moda. Todos los derechos reservados.
        </p>
      </div>
    </footer>
  </div>
</template>

<script>
export default {
  name: 'HomePageFashion',
  components: {},
  data() {
    return {
      // Reemplaza estas URLs con tus imágenes reales de moda
      heroBackgroundImage: '/img/logo.svg', // Ejemplo
      image1Url: '/img/logo.svg', // Ejemplo
      image2Url: '/img/logo.svg', // Ejemplo
      image3Url: '/img/logo.svg' // Ejemplo
    }
  },
  computed: {
    currentYear() {
      return new Date().getFullYear()
    }
  },
  methods: {
    goToProducts() {
      // Asumiendo que tienes una ruta llamada 'e-commerce' para tus productos de ropa
      this.$router.push('/E-Commerce') // Asegúrate que la ruta coincida con la definida en el router
      console.log('Ir a la Colección de Ropa')
    },
    getTicket() {
      // Esta ruta podría llevar a una sección de "Novedades", "Próximos Lanzamientos", "Eventos VIP" o "Blog de Moda"
      // Si '/ticketing' se usa para eventos, es adecuado. Si no, considera cambiar la ruta o el propósito.
      this.$router.push('/ticketing') // Asegúrate que la ruta coincida con la definida en el router
      console.log('Ir a Novedades y Eventos')
    }
  }
}
</script>

<style>
/* Asumiendo que los estilos de @import "@/assets/scss/_home.scss";
   son lo suficientemente genéricos o serán adaptados.
   Si necesitas cambios de estilo específicos para la temática de ropa,
   deberían hacerse en ese archivo o aquí mismo. */
@import '@/assets/scss/_home.scss';
</style>
