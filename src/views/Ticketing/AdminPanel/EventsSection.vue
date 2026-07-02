<template>
  <div class="events-section p-3">
    <div class="section-header d-flex justify-content-between align-items-center mb-4 border-bottom border-secondary pb-3">
      <h2 class="text-white m-0"><i class="fa-solid fa-calendar-days text-primary me-2"></i>Gestión de Eventos</h2>
      <button class="btn btn-primary fw-bold px-4 rounded-pill shadow-sm" @click="openCreateModal">
        <i class="fa-solid fa-plus me-1"></i> Crear Evento
      </button>
    </div>

    <div v-if="loading" class="text-center py-5">
      <i class="fa-solid fa-circle-notch fa-spin fa-3x text-primary mb-3"></i>
      <h5 class="text-white">Cargando eventos...</h5>
    </div>
    
    <div v-else-if="error" class="alert alert-danger shadow-sm">{{ error }}</div>

    <div v-else-if="tickets && tickets.length" class="row">
      <div v-for="event in tickets" :key="event.evento_id" class="col-md-6 col-lg-4 mb-4">
        <div class="card bg-dark border border-secondary shadow-sm h-100">
          <div class="position-relative">
            <img :src="event.imagen_url || 'https://placehold.co/600x400/EEE/31343C?text=Evento'" :alt="event.nombre_evento" class="card-img-top" style="height: 180px; object-fit: cover;" />
            <span class="badge position-absolute top-0 end-0 m-2 px-3 py-2 fs-6 shadow" :class="getBadgeClass(event.estado_evento)">
              {{ event.estado_evento.toUpperCase() }}
            </span>
          </div>
          
          <div class="card-body d-flex flex-column text-white">
            <h5 class="card-title fw-bold text-warning mb-3">{{ event.nombre_evento }}</h5>
            
            <ul class="list-unstyled mb-4 flex-grow-1 small text-light">
              <li class="mb-2"><i class="fa-regular fa-calendar text-muted me-2"></i> {{ new Date(event.fecha_hora_inicio).toLocaleDateString('es-AR', { weekday: 'short', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute:'2-digit' }) }}</li>
              <li class="mb-2"><i class="fa-solid fa-location-dot text-muted me-2"></i> {{ event.lugar_nombre }}</li>
              <li class="mb-2" v-if="event.precio_minimo != null"><i class="fa-solid fa-tag text-muted me-2"></i> Precio Base: <strong class="text-success">${{ formatNumber(Math.round(event.precio_minimo)) }}</strong></li>
            </ul>

            <div class="d-flex gap-2 mt-auto pt-3 border-top border-secondary">
              <button class="btn btn-outline-light w-50 fw-bold shadow-sm" @click="handleEditEvent(event)">
                <i class="fa-solid fa-pen-to-square me-1"></i> Editar
              </button>
              <button class="btn btn-danger w-50 fw-bold shadow-sm" @click="handleDeleteEvent(event)">
                <i class="fa-solid fa-trash me-1"></i> Eliminar
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <div v-else class="text-center py-5 bg-dark border border-secondary rounded">
      <i class="fa-solid fa-calendar-xmark fa-3x text-muted mb-3"></i>
      <h5 class="text-white">No hay eventos creados.</h5>
      <p class="text-muted">Animate a crear tu primer evento para arrancar.</p>
    </div>

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
    ...mapGetters(['tickets', 'loading', 'error', 'formatNumber']), // 🔥 Agregamos formatNumber acá
  },
  created() {
    this.fetchTickets();
  },
  methods: {
    ...mapActions(['fetchTickets', 'deleteEventoAction']),

    getBadgeClass(estado) {
      if (!estado) return 'bg-secondary';
      const est = estado.toLowerCase();
      if (est.includes('disponible')) return 'bg-success';
      if (est.includes('proxima')) return 'bg-info text-dark';
      if (est.includes('agotado')) return 'bg-warning text-dark';
      if (est.includes('cancel')) return 'bg-danger';
      return 'bg-secondary';
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
      if (window.confirm(`¿Estás seguro de que quieres borrar el evento "${event.nombre_evento}"? Toda la información se perderá.`)) {
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