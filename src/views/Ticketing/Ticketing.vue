<template>
  <div class="ticket-page-container">
    <Topbar />

    <header class="page-header container">
      <h1>Nuestros Próximos Eventos y Entradas</h1>
      <p>
        Explora nuestra selección de eventos y asegura tu lugar. ¡Vive
        experiencias inolvidables!
      </p>
    </header>

    <div class="ticket-layout container">
      <main class="tickets-main-content">
        <div v-if="tickets.length === 0" class="no-results">
          <i class="fas fa-sad-tear"></i>
          <p>No se encontraron eventos disponibles.</p>
        </div>
        <div class="tickets-grid" v-else>
          <div class="ticket-card" v-for="ticket in tickets" :key="ticket.id">
            <div class="ticket-image-container">
              <img :src="ticket.imageUrl" :alt="ticket.name" />
              <span class="ticket-category-badge" v-if="ticket.category">{{
                ticket.category
              }}</span>
            </div>
            <div class="ticket-info">
              <h3>{{ ticket.name }}</h3>
              <p class="ticket-description">{{ ticket.shortDescription }}</p>
              <div class="ticket-details">
                <p>
                  <i class="fas fa-calendar-alt"></i> {{ formatDate(ticket.date) }}
                </p>
                <p><i class="fas fa-map-marker-alt"></i> {{ ticket.location }}</p>
              </div>
            </div>
            <div class="ticket-purchase-section">
              <p class="ticket-price">
                Desde <span>${{ ticket.price.toFixed(2) }}</span>
              </p>
              <button class="btn btn-primary" @click="buyTicket(ticket)">
                <i class="fas fa-ticket-alt"></i> Comprar Entrada
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>

    <footer class="site-footer">
      <div class="container">
        <h4>Contáctanos</h4>
        <div class="social-icons">
          <a href="#" target="_blank" aria-label="Facebook"><i class="fab fa-facebook-f"></i></a>
          <a href="#" target="_blank" aria-label="Instagram"><i class="fab fa-instagram"></i></a>
          <a href="#" target="_blank" aria-label="Twitter"><i class="fab fa-twitter"></i></a>
          <a href="#" target="_blank" aria-label="WhatsApp"><i class="fab fa-whatsapp"></i></a>
        </div>
        <p class="copyright">
          &copy; {{ new Date().getFullYear() }} Tu Nombre de Empresa. Todos los
          derechos reservados.
        </p>
      </div>
    </footer>
  </div>
</template>

<script>
import Topbar from '@/components/Topbar.vue'; // Importar el componente Topbar

export default {
  name: "TicketPage",
  components: {
    Topbar // Registrar el componente Topbar
  },
  data() {
    return {
      tickets: [
        {
          id: 1,
          name: "Concierto Noche Estelar",
          shortDescription: "Una noche inolvidable con las mejores bandas de rock.",
          category: "Concierto",
          date: "2025-07-15T20:00:00",
          location: "Estadio Principal, Ciudad A",
          price: 75.0,
          imageUrl: "/img/logo.svg",
        },
        {
          id: 2,
          name: "Obra de Teatro: El Legado",
          shortDescription: "Un drama emocionante que te mantendrá al borde del asiento.",
          category: "Teatro",
          date: "2025-08-02T19:30:00",
          location: "Teatro Nacional, Ciudad B",
          price: 45.5,
          imageUrl: "/img/logo.svg",
        },
        {
          id: 3,
          name: "Festival de Verano SunFest",
          shortDescription: "Música, arte y diversión bajo el sol.",
          category: "Festival",
          date: "2025-07-28T14:00:00",
          location: "Playa Paraíso",
          price: 120.0,
          imageUrl: "/img/logo.svg",
        },
        {
          id: 4,
          name: "Partido Final de Liga",
          shortDescription: "La emoción del deporte en su máxima expresión.",
          category: "Deporte",
          date: "2025-09-10T16:00:00",
          location: "Arena Deportiva, Ciudad A",
          price: 90.0,
          imageUrl: "/img/logo.svg",
        },
        {
          id: 5,
          name: "Exposición de Arte Moderno",
          shortDescription: "Descubre las nuevas tendencias del arte contemporáneo.",
          category: "Exposición",
          date: "2025-06-20T10:00:00",
          location: "Galería Central, Online",
          price: 25.0,
          imageUrl: "/img/logo.svg",
        },
        {
          id: 6,
          name: "Concierto Acústico Íntimo",
          shortDescription: "Una velada especial con tus artistas favoritos en formato acústico.",
          category: "Concierto",
          date: "2025-10-05T21:00:00",
          location: "Café del Arte, Ciudad B",
          price: 55.0,
          imageUrl: "/img/logo.svg",
        },
      ],
    };
  },
  methods: {
    formatDate(dateString) {
      if (!dateString) return "Fecha no especificada";
      const options = {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      };
      return new Date(dateString)
        .toLocaleDateString("es-ES", options)
        .replace(",", " -");
    },
    buyTicket(ticket) {
      alert(`Iniciando proceso de compra para: ${ticket.name}`);
      console.log("Comprando ticket:", ticket);
    },
  },
};
</script>

<style>
@import "@/assets/scss/_ticketing.scss";
</style>
