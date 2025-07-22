<template>
  <div class="events-section">
    <div class="section-header">
      <h2>Gestión de Eventos</h2>
      <button class="btn-primary" @click="openCreateModal">+ Crear Evento</button>
    </div>

    <div v-if="loading" class="loading-state">Cargando eventos...</div>
    <div v-else-if="error" class="error-state">{{ error }}</div>

    <div v-else-if="tickets && tickets.length" class="events-grid">
      <div v-for="event in tickets" :key="event.evento_id" class="event-card">
        <div class="event-image">
          <img :src="event.imagen_url || 'https://placehold.co/600x400/EEE/31343C?text=Evento'" :alt="event.nombre_evento" />
          <div class="event-status" :class="event.estado_evento">{{ event.estado_evento }}</div>
        </div>
        <div class="event-content">
          <h3>{{ event.nombre_evento }}</h3>
          <p class="event-description">{{ event.descripcion }}</p>
          <div class="event-details">
            <span>📅 {{ new Date(event.fecha_hora_inicio).toLocaleDateString('es-AR') }}</span>
            <span>📍 {{ event.lugar_nombre }}</span>
            <span v-if="event.precio_minimo != null">💰 Desde ${{ formatNumber(event.precio_minimo) }}</span>
          </div>
          <div class="event-actions">
            <button class="btn-edit" @click="handleEditEvent(event)">Editar</button>
            <button class="btn-delete" @click="handleDeleteEvent(event)">Eliminar</button>
          </div>
        </div>
      </div>
    </div>
    
    <div v-else class="no-results-state">No se encontraron eventos.</div>

    <ModalForm
      :visible="showCreateOrEditModal"
      :eventoToEdit="eventoParaEditar"
      @update:visible="showCreateOrEditModal = $event"
      @eventSaved="handleEventSaved"
    />
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import ModalForm from '@/views/Ticketing/ModalForm.vue';

export default {
  name: 'EventsSection',
  components: {
    ModalForm
  },
  data() {
    return {
      showCreateOrEditModal: false,
      eventoParaEditar: null,
    }
  },
  computed: {
    // CORREGIDO: Mapeamos los getters que SÍ existen en tu store _eventos.js
    ...mapGetters(['tickets', 'loading', 'error']),
  },
  created() {
    // CORREGIDO: Llamamos a la acción que SÍ existe ('fetchTickets')
    this.fetchTickets();
  },
  methods: {
    // CORREGIDO: Mapeamos las acciones que SÍ existen
    ...mapActions(['fetchTickets', 'deleteEventoAction']),

    // Agregamos formatNumber como un método local ya que no está en los getters de tu store
    formatNumber(num) {
      if (typeof num !== 'number') return num;
      return num.toLocaleString('es-AR');
    },

    openCreateModal() {
      this.eventoParaEditar = null;
      this.showCreateOrEditModal = true;
    },

    handleEditEvent(event) {
      this.eventoParaEditar = { ...event };
      this.showCreateOrEditModal = true;
    },

    async handleDeleteEvent(event) {
      if (window.confirm(`¿Estás seguro de que quieres borrar el evento "${event.nombre_evento}"?`)) {
        try {
          await this.deleteEventoAction(event.evento_id);
          if (this.$toast) this.$toast.success('Evento borrado exitosamente.');
        } catch (err) {
          if (this.$toast) this.$toast.error(err.message || 'Error al borrar el evento.');
          console.error(err);
        }
      }
    },

    handleEventSaved() {
      this.showCreateOrEditModal = false;
    },
  }
}
</script>

<style scoped lang="scss">
@import '@/assets/scss/_adminPanel.scss'; 

/* Estilos adicionales para estados de carga/error */
.loading-state, .error-state, .no-results-state {
  text-align: center;
  padding: 40px;
  font-size: 1.2rem;
  color: #a0a0a0;
}
.error-state {
  color: #f44336;
}
</style>