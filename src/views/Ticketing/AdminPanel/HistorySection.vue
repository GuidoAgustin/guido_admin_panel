<template>
  <div class="historial-container p-4">
    
    <Widget plain icon="fa-solid fa-box-archive">
      <template #title>Archivo Histórico de Eventos</template>
      <template #description>Acá descansan los eventos eliminados. Podés auditar su información o devolverlos a la plataforma activa.</template>

      <FullPageLoader v-if="loadingHistory" />

      <VueTable
        ref="historyTable"
        :headers="tableHeaders"
        :values="archivedTickets"
        :actions="tableActions"
        :searchMinLen="3"
        @changed="fetchData"
        @onRestore="handleRestore"
        @onViewInfo="handleViewInfo" 
      >
        <template #imagen="{ item }">
          <div class="event-thumbnail">
            <img 
              :src="item.imagen_url || 'https://placehold.co/600x400/EEE/31343C?text=Sin+Imagen'" 
              alt="Evento" 
              style="width: 60px; height: 40px; object-fit: cover; border-radius: 4px; filter: grayscale(100%); opacity: 0.8;" 
            />
          </div>
        </template>

        <template #borrado="{ item }">
          <span class="text-danger fw-bold">
            <i class="fa-solid fa-skull mr-1"></i> 
            {{ formatearFecha(item.deleted_at) }}
          </span>
        </template>
      </VueTable>
    </Widget>

    <!-- 🔍 EL MODAL FORENSE OPTIMIZADO -->
    <!-- FIX: Etiqueta limpia y con size="md" -->
    <VueModal 
      v-if="showModal && selectedEvent" 
      size="md" 
      @close="closeModal" 
    >
      <!-- 1️⃣ COMPARTIMENTO DEL TÍTULO -->
      <template #title>Auditoría de Evento Archivado</template>

      <!-- 2️⃣ COMPARTIMENTO PRINCIPAL (EL CUERPO) -->
      <template #body>
        <!-- Header Visual Integrado al Modal -->
        <div class="modal-header-img mb-4 rounded" :style="{ backgroundImage: `url(${selectedEvent.imagen_url || 'https://placehold.co/600x400/EEE/31343C?text=Fantasma'})` }">
          <div class="modal-header-overlay rounded">
            <span class="badge bg-danger mb-2"><i class="fa-solid fa-ghost"></i> Evento Archivado</span>
            <h3 class="text-white m-0">{{ selectedEvent.nombre_evento }}</h3>
          </div>
        </div>

        <div class="row text-dark" style="color: #212529 !important;">
          <!-- Columna Izquierda -->
          <div class="col-md-7 border-end pe-4">
            <h5 class="text-muted text-uppercase fw-bold" style="font-size: 0.85rem; letter-spacing: 1px;">Descripción Original</h5>
            <p class="mb-4">{{ selectedEvent.descripcion || 'Sin descripción detallada.' }}</p>
            
            <div class="info-list mb-4">
              <p><strong><i class="fa-solid fa-map-location-dot text-primary me-2"></i> Ubicación:</strong> {{ selectedEvent.lugar_nombre || 'No especificado' }}</p>
              <p><strong><i class="fa-solid fa-calendar-day text-primary me-2"></i> Inicio:</strong> {{ formatearFechaCompleta(selectedEvent.fecha_hora_inicio) }}</p>
              <p v-if="selectedEvent.fecha_hora_fin"><strong><i class="fa-solid fa-calendar-check text-primary me-2"></i> Fin:</strong> {{ formatearFechaCompleta(selectedEvent.fecha_hora_fin) }}</p>
            </div>

            <!-- 📈 LAZY LOADING & WIDGET COUNTER -->
            <h6 class="fw-bold mb-3 border-top pt-3"><i class="fa-solid fa-chart-line text-success"></i> Rendimiento del Evento</h6>
            
            <div v-if="loadingStats" class="text-center p-3">
              <div class="spinner-border text-primary spinner-border-sm" role="status"></div>
              <span class="ms-2 small">Calculando ventas...</span>
            </div>
            
            <div v-else-if="eventStats" class="row">
              <div class="col-12 mb-3">
                <WidgetCounter 
                  title="Recaudación Total" 
                  :value="formatCurrency(eventStats.totalRevenue)" 
                  icon="fa-solid fa-money-bill-wave"
                />
              </div>
              <div class="col-12">
                <div class="d-flex justify-content-between small mb-1">
                  <span class="text-muted">Entradas Vendidas: <strong>{{ eventStats.totalSold }} / {{ eventStats.totalCapacity }}</strong></span>
                  <span class="fw-bold text-primary">{{ eventStats.percentage }}%</span>
                </div>
                <div class="progress" style="height: 10px;">
                  <div class="progress-bar bg-primary progress-bar-striped" role="progressbar" :style="{ width: eventStats.percentage + '%' }"></div>
                </div>
                
                <!-- 👇 NUEVO: El indicador de Cancelaciones 👇 -->
                <div v-if="eventStats.totalCanceled > 0" class="d-flex justify-content-between small text-danger mt-2 pt-1 border-top border-danger border-opacity-25">
                  <span><i class="fa-solid fa-ban me-1"></i> Entradas Canceladas:</span>
                  <strong class="fw-bold">{{ eventStats.totalCanceled }}</strong>
                </div>
                <div v-else class="d-flex justify-content-between small text-muted mt-2 pt-1 border-top">
                  <span><i class="fa-solid fa-check-double me-1"></i> Cancelaciones:</span>
                  <span>0 (¡Excelente!)</span>
                </div>
              </div>
            </div>
            
            <!-- 👇 FIX: Paracaídas por si el backend falla 👇 -->
            <div v-else class="alert alert-warning small p-2 text-center">
              <i class="fa-solid fa-triangle-exclamation"></i> No hay datos de rendimiento disponibles.
            </div>

          </div>

          <!-- Columna Derecha -->
          <div class="col-md-5 ps-4">
            <div class="auditoria-box bg-light p-3 rounded mb-4 border border-danger">
              <h6 class="text-danger fw-bold border-bottom border-danger pb-2 mb-3"><i class="fa-solid fa-book-skull"></i> Datos de Baja</h6>
              <p class="mb-1"><small><strong>Eliminado el:</strong> {{ formatearFechaCompleta(selectedEvent.deleted_at) }}</small></p>
              <p class="mb-0"><small><strong>Estado al borrar:</strong> <span class="badge bg-secondary text-uppercase">{{ selectedEvent.estado_evento || 'Desconocido' }}</span></small></p>
            </div>

            <h6 class="fw-bold mb-3"><i class="fa-solid fa-ticket"></i> Tipos de Entrada</h6>
            <ul class="list-group list-group-flush shadow-sm rounded" v-if="selectedEvent.tipos_entrada && selectedEvent.tipos_entrada.length">
              <li class="list-group-item d-flex justify-content-between align-items-center" v-for="tipo in selectedEvent.tipos_entrada" :key="tipo.id_tipo_entrada">
                <div>
                  <span class="fw-bold d-block text-dark" style="font-size: 0.9rem;">{{ tipo.nombre_tipo }}</span>
                  <small class="text-muted">Stock: {{ tipo.cantidad_total }}</small>
                </div>
                <span class="badge bg-success rounded-pill px-3 py-2">{{ formatCurrency(tipo.precio) }}</span>
              </li>
            </ul>
            <div v-else class="alert alert-light text-center small mt-2 border">
              <i>No hay tickets configurados.</i>
            </div>
          </div>
        </div>
      </template>

      <!-- 3️⃣ COMPARTIMENTO DEL PIE (LOS BOTONES) -->
      <template #footer>
        <div class="w-100 d-flex justify-content-between align-items-center">
          <small class="text-muted"><i class="fa-solid fa-circle-info"></i> Modo auditoría.</small>
          <div>
            <button class="btn btn-outline-secondary me-2" @click="closeModal" :disabled="isRestoring">Cerrar Visor</button>
            <button class="btn btn-success px-4" @click="handleRestore(selectedEvent)" :disabled="isRestoring">
              <i class="fa-solid fa-heart-pulse me-2"></i> {{ isRestoring ? 'Resucitando...' : 'Resucitar' }}
            </button>
          </div>
        </div>
      </template>

    </VueModal>

  </div>
</template>

<script>
import Widget from '@/components/Widget.vue';
import VueTable from '@/components/Tables/VueTable.vue';
import FullPageLoader from '@/components/FullPageLoader.vue';
import VueModal from '@/components/Modal/VueModal.vue'; 
import WidgetCounter from '@/components/WidgetCounter.vue';
import { mapGetters, mapActions } from 'vuex';

export default {
  name: 'HistorialEventos',
  components: { 
    Widget, 
    VueTable, 
    FullPageLoader,
    VueModal,       
    WidgetCounter   
  },
  data: () => ({
    tableHeaders: [
      { title: 'imagen', mask: 'Póster', slot: 'imagen', width: 10 },
      { title: 'nombre_evento', mask: 'Nombre del Evento', sortable: true },
      { title: 'lugar_nombre', mask: 'Ubicación' },
      { title: 'deleted_at', mask: 'Fecha de Baja', slot: 'borrado', sortable: true }
    ],
    tableActions: [
      { title: 'Ver Info', callback: 'onViewInfo', icon: 'fa-solid fa-eye text-primary' },
      { title: 'Restaurar', callback: 'onRestore', icon: 'fa-solid fa-trash-restore text-success' }
    ],
    showModal: false,
    selectedEvent: null,
    
    loadingStats: false,
    eventStats: null,

    isRestoring: false 
  }),
  computed: {
    ...mapGetters(['archivedTickets', 'loadingHistory']) 
  },
  methods: {
    ...mapActions(['fetchArchivedTickets', 'restoreEventoAction', 'fetchSingleEventStats']),

    fetchData(tableParams) {
      this.fetchArchivedTickets(tableParams);
    },

    async handleViewInfo(item) {
      this.selectedEvent = item;
      this.showModal = true;
      this.eventStats = null;
      this.loadingStats = true;

      const stats = await this.fetchSingleEventStats(item.evento_id);
      this.eventStats = stats;
      this.loadingStats = false;
    },

    closeModal() {
      if (this.isRestoring) return;
      this.showModal = false;
      setTimeout(() => { 
        this.selectedEvent = null; 
        this.eventStats = null;
      }, 300); 
    },

    async handleRestore(item) {
      const confirmacion = confirm(`¿Estás seguro de que querés restaurar el evento "${item.nombre_evento}"?`);
      if (confirmacion) {
        try {
          this.isRestoring = true; 
          await this.restoreEventoAction(item.evento_id);
          if (this.$toast) this.$toast.success('¡Evento resucitado con éxito! 🧟‍♂️✨');
          this.closeModal(); 
          this.$refs.historyTable.changed(); 
        } catch (error) {
          if (this.$toast) this.$toast.error('Hubo un error al restaurar.');
        } finally {
          this.isRestoring = false; 
        }
      }
    },
    
    formatearFecha(fecha) {
      if (!fecha) return '-';
      return new Date(fecha).toLocaleDateString('es-AR', { day: '2-digit', month: 'short', year: 'numeric' });
    },

    formatearFechaCompleta(fecha) {
      if (!fecha) return '-';
      return new Date(fecha).toLocaleString('es-AR', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
    },

    formatCurrency(value) {
      if (!value) return '$ 0';
      return Number(value).toLocaleString('es-AR', { style: 'currency', currency: 'ARS', minimumFractionDigits: 0 });
    }
  },
  mounted() {
    this.$nextTick(() => { this.$refs.historyTable?.init(); });
  }
};
</script>

<style scoped>
.event-thumbnail img { box-shadow: 0 2px 4px rgba(0,0,0,0.2); transition: filter 0.3s ease; }
.event-thumbnail:hover img { filter: grayscale(0%) !important; opacity: 1 !important; }

.modal-header-img { height: 160px; background-size: cover; background-position: center; position: relative; }
.modal-header-overlay {
  position: absolute; top: 0; left: 0; right: 0; bottom: 0;
  background: linear-gradient(to bottom, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.9) 100%);
  padding: 1.5rem; display: flex; flex-direction: column; justify-content: flex-end; align-items: flex-start;
}
</style>