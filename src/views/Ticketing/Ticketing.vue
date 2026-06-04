<template>
  <div class="ticket-page-container">
    <Topbar />

    <header class="page-header container d-flex align-items-center justify-content-between">
      <div>
        <h1>Nuestros Próximos Eventos</h1>
        <p>Explora nuestra selección de eventos y asegura tu lugar. ¡Vive experiencias inolvidables!</p>
      </div>
    </header>

    <div class="ticket-layout container">
      <main class="tickets-main-content">
        <div v-if="loading" class="no-results">
          <i class="fas fa-spinner fa-spin"></i>
          <p>Cargando eventos...</p>
        </div>

        <div v-else-if="error" class="no-results">
          <i class="fas fa-exclamation-triangle"></i>
          <p>{{ error }}</p>
        </div>

        <div v-else-if="!tickets || tickets.length === 0" class="no-results">
          <i class="fas fa-sad-tear"></i>
          <p>No se encontraron eventos disponibles.</p>
        </div>

        <div class="tickets-grid" v-else>
          <div
            class="ticket-card"
            v-for="ticket in tickets"
            :key="ticket.evento_id"
          >
            <div class="ticket-image-container">
              <img
                :src="ticket.imagen_url || 'https://placehold.co/600x400/EEE/31343C?text=Evento'"
                :alt="ticket.nombre_evento"
                @click="showEnlargedImage(ticket.imagen_url || 'https://placehold.co/600x400/EEE/31343C?text=Evento')"
                style="cursor: pointer; object-fit: cover; height: 200px; width: 100%;"
                onerror="this.onerror=null;this.src='https://placehold.co/600x400/EEE/31343C?text=Error+Img'"
              />
              <span class="ticket-category-badge" v-if="ticket.categoria">
                {{ ticket.categoria }}
              </span>
            </div>

            <div class="ticket-info">
              <h3>{{ ticket.nombre_evento }}</h3>
              <p class="ticket-description">{{ ticket.descripcion }}</p>
              <div class="ticket-details">
                <p>
                  <i class="fas fa-calendar-alt"></i>
                  Inicio: {{ formatDate(ticket.fecha_hora_inicio) }}
                </p>
                <p v-if="ticket.fecha_hora_fin">
                  <i class="fas fa-calendar-check"></i>
                  Fin: {{ formatDate(ticket.fecha_hora_fin) }}
                </p>
                <p>
                  <i class="fas fa-map-marker-alt"></i>
                  {{ ticket.lugar_nombre }}, {{ ticket.lugar_direccion }}
                </p>
                <p>
                  <i class="fas fa-info-circle"></i>
                  Estado: <strong>{{ ticket.estado_evento.toUpperCase() }}</strong>
                  <span v-if="estaEnCurso(ticket)" class="badge bg-warning text-dark ms-2"><i class="fas fa-fire"></i> Último Minuto</span>
                </p>
              </div>
            </div>

            <div class="ticket-purchase-section">
              <!-- CONTENEDOR DEL PRECIO LIMPIO -->
              <div v-if="ticket.precio_minimo !== undefined" class="price-container">
                <span class="price-label">DESDE</span>
                <span class="price-amount">${{ formatPrice(ticket.precio_minimo) }}</span>
              </div>
              <div v-else></div>
              
              <!-- BOTÓN -->
              <button
                class="btn btn-primary fw-bold shadow-sm"
                @click="prepararCompra(ticket)"
                :disabled="!puedeComprar(ticket)"
              >
                <i class="fas fa-ticket-alt me-2"></i> Conseguir Entradas
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>

    <Modals
      :showBuyModal="showBuyModal"
      :showRegisterModal="showRegisterModal"
      :ticketSeleccionado="ticketSeleccionado"
      @closeBuyModal="showBuyModal = false"
      @closeRegisterModal="showRegisterModal = false"
      @goToRegister="goToRegister"
    />

    <div v-if="selectedImageUrl" class="image-enlarger-overlay" @click="closeEnlargedImage">
      <img :src="selectedImageUrl" alt="Imagen agrandada del evento" class="enlarged-image" />
    </div>

    <SiteFooter />
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import Topbar from '@/components/Topbar.vue';
import Modals from './Modals.vue'; 
import SiteFooter from '@/components/SiteFooter.vue';

export default {
  name: 'TicketPage',
  components: { Topbar, Modals, SiteFooter },
  data() {
    return {
      showBuyModal: false,
      showRegisterModal: false,
      ticketSeleccionado: null,     
      selectedImageUrl: null
    };
  },
  computed: {
    ...mapGetters(['tickets', 'loading', 'error']),
  },
  mounted() {
    this.fetchTickets();
  },
  methods: {
    ...mapActions(['fetchTickets']),

    puedeComprar(ticket) {
      if (ticket.estado_evento === 'disponible') return true;
      if (ticket.vender_durante_evento && ticket.estado_evento !== 'cancelado' && ticket.estado_evento !== 'agotado') {
        if (ticket.fecha_hora_fin) {
          const ahora = new Date();
          const fin = new Date(ticket.fecha_hora_fin);
          if (ahora <= fin) return true;
        }
      }
      return false;
    },

    estaEnCurso(ticket) {
      if (!ticket.vender_durante_evento || ticket.estado_evento === 'cancelado' || ticket.estado_evento === 'agotado') return false;
      const ahora = new Date();
      const inicio = new Date(ticket.fecha_hora_inicio);
      const fin = ticket.fecha_hora_fin ? new Date(ticket.fecha_hora_fin) : null;
      return ahora >= inicio && fin && ahora <= fin;
    },

    // ✨ UX: Formateamos el precio para que no tenga decimales si no los necesita y use puntos
    formatPrice(price) {
      if (!price) return '0';
      return Math.round(price).toLocaleString('es-AR');
    },

    // ✨ UX: Fechas legibles (ej: "25 de mayo de 2026, 20:00")
    formatDate(dateString) {
      if (!dateString) return '—';
      const options = {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
      };
      return new Date(dateString).toLocaleDateString('es-AR', options);
    },

    prepararCompra(ticket) {
      const isLoggedIn = this.$store.getters.isLoggedIn;
      if (!isLoggedIn) {
        this.showRegisterModal = true; 
        return;
      }
      this.ticketSeleccionado = ticket; 
      this.showBuyModal = true;        
    },

    goToRegister() {
      this.showRegisterModal = false;
      this.$router.push({ name: 'login' }); 
    },

    showEnlargedImage(imageUrl) {
      this.selectedImageUrl = imageUrl;
    },
    closeEnlargedImage() {
      this.selectedImageUrl = null;
    }
  }
};
</script>

<style>
/* Importamos el archivo base original sin tocarlo */
@import '@/assets/scss/_ticketing.scss';
</style>