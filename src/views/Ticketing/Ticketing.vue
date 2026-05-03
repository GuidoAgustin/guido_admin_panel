<template>
  <div class="ticket-page-container">
    <Topbar />

    <header class="page-header container d-flex align-items-center justify-content-between">
      <div>
        <h1>Nuestros Próximos Eventos y Entradas</h1>
        <p>
          Explora nuestra selección de eventos y asegura tu lugar. ¡Vive experiencias inolvidables!
        </p>
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
                @click="
                  showEnlargedImage(
                    ticket.imagen_url || 'https://placehold.co/600x400/EEE/31343C?text=Evento'
                  )
                "
                style="cursor: pointer"
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
                  Estado: <strong>{{ ticket.estado_evento }}</strong>
                </p>
              </div>
            </div>

            <div class="ticket-purchase-section">
              <p class="ticket-price mb-2" v-if="ticket.precio_minimo !== undefined">
                Desde
                <span> ${{ Number(ticket.precio_minimo).toFixed(2) }} </span>
              </p>
              
              <div class="d-flex gap-2 w-100">
                <button
                  class="btn btn-outline-success flex-fill"
                  @click="prepararCompra(ticket, 'carrito')"
                  :disabled="ticket.estado_evento !== 'disponible'"
                  title="Guardar asiento para pagar después"
                >
                  <i class="fas fa-cart-plus"></i> Al Carrito
                </button>
                <button
                  class="btn btn-primary flex-fill"
                  @click="prepararCompra(ticket, 'comprar_ahora')"
                  :disabled="ticket.estado_evento !== 'disponible'"
                  title="Reservar e ir a Mercado Pago"
                >
                  <i class="fas fa-bolt"></i> Comprar
                </button>
              </div>

            </div>
          </div>
        </div>
      </main>
    </div>

    <Modals
      :showBuyModal="showBuyModal"
      :showRegisterModal="showRegisterModal"
      :ticketSeleccionado="ticketSeleccionado"
      :tipoAccion="tipoDeAccion" 
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
      selectedImageUrl: null,    
      tipoDeAccion: 'carrito' // Novedad: Guardamos qué botón eligió el usuario
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

    formatDate(dateString) {
      if (!dateString) return '—';
      const options = {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
      };
      return new Date(dateString).toLocaleDateString('es-ES', options);
    },

    // FUNCIÓN NUEVA: Atrapa el clic de ambos botones y abre el modal avisándole qué hacer
    prepararCompra(ticket, accion) {
      const isLoggedIn = !!localStorage.getItem('token') || !!localStorage.getItem('user');
      if (!isLoggedIn) {
        this.showRegisterModal = true; 
        return;
      }
      this.ticketSeleccionado = ticket; 
      this.tipoDeAccion = accion; // 'carrito' o 'comprar_ahora'
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
@import '@/assets/scss/_ticketing.scss';
</style>