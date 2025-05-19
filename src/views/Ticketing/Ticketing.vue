<template>
  <div class="ticket-page-container">
    <Topbar />

    <header class="page-header container d-flex align-items-center justify-content-between">
      <div>
        <h1>Nuestros Próximos Eventos y Entradas</h1>
        <p>
          Explora nuestra selección de eventos y asegura tu lugar. ¡Vive
          experiencias inolvidables!
        </p>
      </div>
      <button class="btn btn-success" @click="showCreate = true">
        + Crear Evento
      </button>
    </header>

    <div class="ticket-layout container">
      <main class="tickets-main-content">
        <!-- Loader local -->
        <div v-if="loading" class="no-results">
          <i class="fas fa-spinner fa-spin"></i>
          <p>Cargando eventos...</p>
        </div>

        <!-- Error local -->
        <div v-else-if="error" class="no-results">
          <i class="fas fa-exclamation-triangle"></i>
          <p>{{ error }}</p>
        </div>

        <!-- Sin resultados -->
        <div v-else-if="tickets.length === 0" class="no-results">
          <i class="fas fa-sad-tear"></i>
          <p>No se encontraron eventos disponibles.</p>
        </div>

        <!-- Listado de eventos -->
        <div class="tickets-grid" v-else>
          <div class="ticket-card" v-for="ticket in tickets" :key="ticket.evento_id">
            <!-- Imagen y categoría -->
            <div class="ticket-image-container">
              <img :src="ticket.imagen_url" :alt="ticket.nombre_evento" />
              <span class="ticket-category-badge" v-if="ticket.categoria">
                {{ ticket.categoria }}
              </span>
            </div>

            <!-- Información básica -->
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

            <!-- Sección de compra -->
            <div class="ticket-purchase-section">
              <p class="ticket-price" v-if="ticket.precio_minimo !== undefined">
                Desde
                <span>
                  ${{ Number(ticket.precio_minimo).toFixed(2) }}
                </span>
              </p>
              <button class="btn btn-primary" @click="buyTicket(ticket)">
                <i class="fas fa-ticket-alt"></i> Comprar Entrada
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>

    <!-- Modals de compra y registro -->
    <Modals :showBuyModal="showBuyModal" :showRegisterModal="showRegisterModal" :ticketSeleccionado="ticketSeleccionado"
      @closeBuyModal="showBuyModal = false" @closeRegisterModal="showRegisterModal = false"
      @goToRegister="goToRegister" />

    <!-- Modal de creación de evento -->
    <ModalForm :visible="showCreate" @update:visible="showCreate = $event" />

    <footer class="site-footer">
      <button class="btn btn-back" @click="$router.back()" style="margin: 0 0 10px 16px;">
        <i class="fas fa-arrow-left"></i> Ir para atrás
      </button>
      <div class="container">
        <h4>Contáctanos</h4>
        <div class="social-icons">
          <a href="#" aria-label="Facebook"><i class="fab fa-facebook-f"></i></a>
          <a href="#" aria-label="Instagram"><i class="fab fa-instagram"></i></a>
          <a href="#" aria-label="Twitter"><i class="fab fa-twitter"></i></a>
          <a href="#" aria-label="WhatsApp"><i class="fab fa-whatsapp"></i></a>
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
import { mapGetters, mapActions } from 'vuex'
import Topbar from '@/components/Topbar.vue'
import Modals from './Modals.vue'
import ModalForm from './ModalForm.vue'

export default {
  name: 'TicketPage',
  components: { Topbar, Modals, ModalForm },
  data() {
    return {
      showBuyModal: false,
      showRegisterModal: false,
      ticketSeleccionado: null,
      showCreate: false
    }
  },
  computed: {
    ...mapGetters('eventos', ['tickets', 'loading', 'error'])
  },
  mounted() {
    this.fetchTickets()
  },
  methods: {
    ...mapActions('eventos', ['fetchTickets']),
    formatDate(dateString) {
      if (!dateString) return '—'
      const options = {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
      }
      return new Date(dateString).toLocaleDateString('es-ES', options)
    },
    buyTicket(ticket) {
      const isLoggedIn = !!localStorage.getItem('token') || !!localStorage.getItem('user')
      if (!isLoggedIn) {
        this.showRegisterModal = true
        return
      }
      this.ticketSeleccionado = ticket
      this.showBuyModal = true
    },
    goToRegister() {
      this.showRegisterModal = false
      this.$router.push({ name: 'login' })
    }
  }
}
</script>

<style>
@import '@/assets/scss/_ticketing.scss';
</style>
