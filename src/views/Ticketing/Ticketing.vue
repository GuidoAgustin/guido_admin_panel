<template>
  <div class="ticket-page-container">
    <Topbar />

    <!-- 🌟 HEADER CON BUSCADOR INTEGRADO (FLEXBOX PURO) -->
    <header class="page-header container d-flex align-items-center justify-content-between flex-wrap gap-3 my-4">
      
      <!-- Lado Izquierdo: Títulos originales (sin estilos forzados) -->
      <div class="header-titles">
        <h1>Nuestros Próximos Eventos</h1>
        <p>Explora nuestra selección de eventos y asegura tu lugar. ¡Vive experiencias inolvidables!</p>
      </div>

      <!-- Lado Derecho: 🔍 Buscador Compacto Robusto -->
      <div class="search-container" style="max-width: 350px; width: 100%;">
        <!-- Contenedor blanco con flexbox estricto -->
        <div class="d-flex align-items-center bg-white shadow-sm" style="border-radius: 8px; padding: 0.35rem 1rem; border: 1px solid #e2e8f0;">
          
          <!-- Ícono de la lupa -->
          <i class="fas fa-search" style="color: #6c757d;"></i>

          <!-- Input de texto -->
          <input 
            type="text" 
            class="form-control border-0 shadow-none bg-transparent" 
            v-model="searchQuery" 
            placeholder="Buscar evento, tipo, lugar..."
            style="font-size: 0.95rem; color: #333; flex-grow: 1; padding-left: 12px;"
          >

          <!-- Botón de limpiar la cruz -->
          <button 
            v-if="searchQuery" 
            class="btn btn-link text-muted p-0 border-0" 
            @click="searchQuery = ''"
            style="text-decoration: none;"
          >
            <i class="fas fa-times"></i>
          </button>
          
        </div>
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

        <!-- 👇 Ahora validamos contra filteredTickets -->
        <div v-else-if="!filteredTickets || filteredTickets.length === 0" class="no-results">
          <i class="fas fa-sad-tear"></i>
          <p v-if="searchQuery">No encontramos eventos que coincidan con "{{ searchQuery }}".</p>
          <p v-else>No se encontraron eventos disponibles.</p>
        </div>

        <div class="tickets-grid" v-else>
          <!-- 👇 Acá está la magia: iteramos filteredTickets en vez de tickets -->
          <div
            class="ticket-card"
            v-for="ticket in filteredTickets"
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
              <div v-if="ticket.precio_minimo !== undefined" class="price-container">
                <span class="price-label">DESDE</span>
                <span class="price-amount">${{ formatPrice(ticket.precio_minimo) }}</span>
              </div>
              <div v-else></div>
              
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
      searchQuery: '', // 👈 La memoria de lo que escribe el usuario
      showBuyModal: false,
      showRegisterModal: false,
      ticketSeleccionado: null,     
      selectedImageUrl: null
    };
  },
  computed: {
    ...mapGetters(['tickets', 'loading', 'error']),
    
    // 🧠 EL MOTOR DE BÚSQUEDA EN TIEMPO REAL
    filteredTickets() {
      if (!this.tickets) return [];
      
      // Si la barra está vacía, devolvemos todo intacto
      if (!this.searchQuery.trim()) return this.tickets;

      const termino = this.searchQuery.toLowerCase().trim();

      return this.tickets.filter(ticket => {
        return (
          (ticket.nombre_evento && ticket.nombre_evento.toLowerCase().includes(termino)) ||
          (ticket.lugar_nombre && ticket.lugar_nombre.toLowerCase().includes(termino)) ||
          (ticket.categoria && ticket.categoria.toLowerCase().includes(termino)) ||
          (ticket.descripcion && ticket.descripcion.toLowerCase().includes(termino))
        );
      });
    }
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

    formatPrice(price) {
      if (!price) return '0';
      return Math.round(price).toLocaleString('es-AR');
    },

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

/* Un toque de magia extra para que el buscador no tenga ese borde azul feo de Chrome */
.input-group input:focus {
  outline: none;
  box-shadow: none;
}
</style>