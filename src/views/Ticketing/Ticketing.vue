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
      <button class="btn btn-success" @click="openCreateModal">+ Crear Evento</button>
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
            <div class="ticket-actions-wrapper">
              <button
                @click.stop="toggleActionMenu(ticket.evento_id)"
                class="btn btn-sm btn-light ticket-action-toggler"
                aria-label="Acciones del evento"
              >
                <i class="fas fa-ellipsis-v"></i>
              </button>
              <div
                v-if="activeActionMenu === ticket.evento_id"
                class="ticket-actions-menu-panel"
                @click.stop
              >
                <button
                  @click="handleEditEvent(ticket)"
                  class="btn btn-sm btn-block text-left btn-outline-primary rounded-pill ticket-actions-menu-item ticket-actions-menu-item-edit"
                >
                  <i class="fas fa-edit"></i>Editar
                </button>

                <button
                  @click="handleDeleteEvent(ticket)"
                  class="btn btn-sm btn-block text-left btn-outline-danger rounded-pill ticket-actions-menu-item"
                >
                  <i class="fas fa-trash"></i>Borrar
                </button>
              </div>
            </div>
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
              <p class="ticket-price" v-if="ticket.precio_minimo !== undefined">
                Desde
                <span> ${{ Number(ticket.precio_minimo).toFixed(2) }} </span>
              </p>
              <button
                class="btn btn-primary"
                @click="buyTicket(ticket)"
                :disabled="ticket.estado_evento !== 'disponible'"
              >
                <i class="fas fa-ticket-alt"></i> Comprar Entrada
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

    <ModalForm
      :visible="showCreateOrEditModal"
      :eventoToEdit="eventoParaEditar"
      @update:visible="showCreateOrEditModal = $event"
      @eventSaved="handleEventSaved"
    />

    <div v-if="selectedImageUrl" class="image-enlarger-overlay" @click="closeEnlargedImage">
      <img :src="selectedImageUrl" alt="Imagen agrandada del evento" class="enlarged-image" />
    </div>

    <footer class="site-footer">
      <button class="btn btn-back" @click="$router.back()" style="margin: 0 0 10px 16px">
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
          &copy; {{ new Date().getFullYear() }} Tu Nombre de Empresa. Todos los derechos reservados.
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
      showCreateOrEditModal: false,
      selectedImageUrl: null,
      eventoParaEditar: null,
      activeActionMenu: null
    }
  },
  computed: {
    ...mapGetters(['tickets', 'loading', 'error'])
  },
  mounted() {
    this.fetchTickets()
    document.addEventListener('click', this.handleClickOutsideActionMenu)
  },
  beforeUnmount() {
    document.removeEventListener('click', this.handleClickOutsideActionMenu)
  },
  methods: {
    ...mapActions(['fetchTickets', 'deleteEventoAction']),

    openCreateModal() {
      this.eventoParaEditar = null
      this.activeActionMenu = null
      this.showCreateOrEditModal = true
    },

    toggleActionMenu(ticketId) {
      if (this.activeActionMenu === ticketId) {
        this.activeActionMenu = null
      } else {
        this.activeActionMenu = ticketId
      }
    },

    handleClickOutsideActionMenu(event) {
      if (this.activeActionMenu === null) {
        return
      }
      const clickedElement = event.target
      const clickedOnAnActionButtonToggler = clickedElement.closest(
        'button[aria-label="Acciones del evento"]'
      )
      // Usamos una clase para el panel del menú para un selector más robusto
      const clickedInsideActionMenuContent = clickedElement.closest('.ticket-actions-menu-panel');

      if (clickedOnAnActionButtonToggler) {
        return
      }
      if (!clickedInsideActionMenuContent) {
        this.activeActionMenu = null
      }
    },

    handleEditEvent(ticket) {
      console.log('Editar evento:', ticket)
      this.eventoParaEditar = { ...ticket }
      this.showCreateOrEditModal = true
      this.activeActionMenu = null
    },

    async handleDeleteEvent(ticket) {
      console.log('Borrar evento:', ticket)
      this.activeActionMenu = null
      if (
        window.confirm(`¿Estás seguro de que quieres borrar el evento "${ticket.nombre_evento}"?`)
      ) {
        try {
          await this.deleteEventoAction(ticket.evento_id)
          if (this.$toast) this.$toast.success('Evento borrado exitosamente.')
          this.fetchTickets()
        } catch (err) {
          console.error('Error al borrar evento:', err)
          if (this.$toast) this.$toast.error(err.message || 'Error al borrar el evento.')
        }
      }
    },

    handleEventSaved() {
      this.fetchTickets()
      this.showCreateOrEditModal = false
    },

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
    },

    showEnlargedImage(imageUrl) {
      this.activeActionMenu = null
      this.selectedImageUrl = imageUrl
    },

    closeEnlargedImage() {
      this.selectedImageUrl = null
    }
  }
}
</script>

<style>
@import '@/assets/scss/_ticketing.scss';
</style>
