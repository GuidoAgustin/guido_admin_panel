<template>
  <div class="events-section p-3">
    <div class="section-header d-flex justify-content-between align-items-center mb-4 border-bottom border-secondary pb-3">
      <h2 class="text-white m-0"><i class="fa-solid fa-calendar-days text-primary me-2"></i>Gestión de Eventos</h2>
      <div class="d-flex gap-3">
        <!-- 🔍 Buscador simple para Tsunami Mode -->
        <input 
          type="text" 
          class="form-control bg-dark text-white border-secondary" 
          placeholder="Buscar evento..." 
          v-model="searchQuery"
          @keyup.enter="handleSearch"
        />
        <button class="btn btn-primary fw-bold px-4 rounded-pill shadow-sm text-nowrap" @click="openCreateModal">
          <i class="fa-solid fa-plus me-1"></i> Crear Evento
        </button>
      </div>
    </div>

    <!-- 🛡️ Fix del Bucle: El loader ahora flota por encima, NO destruye el contenido -->
    <FullPageLoader v-if="loading" />
    
    <div v-if="error" class="alert alert-danger shadow-sm">{{ error }}</div>

    <!-- 🧱 LEGO: Tus hermosas tarjetas están de vuelta, iterando sobre tickets.data -->
    <div v-else-if="tickets?.data?.length" class="row">
      <div v-for="event in tickets.data" :key="event.evento_id" class="col-md-6 col-lg-4 mb-4">
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
              <li class="mb-2"><i class="fa-regular fa-calendar text-muted me-2"></i> {{ formatearFecha(event.fecha_hora_inicio) }}</li>
              <li class="mb-2"><i class="fa-solid fa-location-dot text-muted me-2"></i> {{ event.lugar_nombre }}</li>
              <li class="mb-2" v-if="event.precio_minimo != null"><i class="fa-solid fa-tag text-muted me-2"></i> Precio Base: <strong class="text-success">${{ formatNumber(Math.round(event.precio_minimo)) }}</strong></li>
            </ul>
            <button 
              class="btn w-100 mb-2 fw-bold shadow-sm d-flex justify-content-center align-items-center"
              :class="event.estado_evento === 'borrador' ? 'btn-success' : 'btn-outline-warning'"
              @click="toggleVisibility(event)"
            >
              <i class="fa-solid me-2" :class="event.estado_evento === 'borrador' ? 'fa-eye' : 'fa-eye-slash'"></i>
              {{ event.estado_evento === 'borrador' ? 'Publicar Evento' : 'Ocultar al publico' }}
            </button>
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
      <h5 class="text-white">No hay eventos para mostrar.</h5>
    </div>

    <!-- 🧭 Paginador Inyectado al final -->
    <div class="d-flex justify-content-center mt-4" v-if="tickets?.data?.length">
      <SimplePager 
        :from="tickets.from"
        :to="tickets.to"
        :total="tickets.total"
        :lastPage="tickets.last_page"
        :actualPage="tickets.current_page"
        @change="changePage"
      />
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
import FullPageLoader from '@/components/FullPageLoader.vue';
import SimplePager from '@/components/SimplePager.vue';

export default {
  name: 'EventsSection',
  components: {
    ModalForm,
    FullPageLoader,
    SimplePager
  },
  data() {
    return {
      showCreateOrEditModal: false,
      eventoParaEditar: null,
      searchQuery: '',
      currentPage: 1
    }
  },
  computed: {
    // tickets ahora es el objeto completo de paginación de Laravel
    ...mapGetters(['tickets', 'loading', 'error', 'formatNumber']), 
  },
  created() {
    this.fetchData();
  },
  methods: {
    ...mapActions(['fetchTickets', 'deleteEventoAction']),

    // 📡 Controlador central de datos
    fetchData() {
      this.fetchTickets({ 
        page: this.currentPage, 
        search: this.searchQuery,
        per_page: 9 // Ideal para grillas de 3 columnas
      });
    },

    changePage(newPage) {
      this.currentPage = newPage;
      this.fetchData();
    },

    handleSearch() {
      this.currentPage = 1; // Resetea a la primera página al buscar
      this.fetchData();
    },

    formatearFecha(fecha) {
      if (!fecha) return '';
      return new Date(fecha).toLocaleDateString('es-AR', { 
        weekday: 'short', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute:'2-digit' 
      });
    },

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
      if (window.confirm(`¿Estás seguro de que quieres borrar el evento "${event.nombre_evento}"?`)) {
        try {
          await this.deleteEventoAction(event.evento_id);
          if (this.$toast) this.$toast.success('Evento borrado exitosamente.');
          this.fetchData(); // Refresca la página actual
        } catch (err) {
          if (this.$toast) this.$toast.error(err.message || 'Error al borrar el evento.');
        }
      }
    },

    handleEventSaved() {
      this.showCreateOrEditModal = false;
      this.fetchData();
    },

    async toggleVisibility(event) {
      const nuevoEstado = event.estado_evento === 'borrador' ? 'disponible' : 'borrador';
      try {
        await this.$store.dispatch('updateEventoAction', { 
          eventoId: event.evento_id,
          eventoData: { estado_evento: nuevoEstado }
        });
        if (this.$toast) {
          this.$toast.success(nuevoEstado === 'borrador' ? 'Evento ocultado.' : '¡Evento publicado!');
        }
        this.fetchData();
      } catch (err) {
        if (this.$toast) this.$toast.error('Error al cambiar la visibilidad.');
      }
    },
  }
}
</script>