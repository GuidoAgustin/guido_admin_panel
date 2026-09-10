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

    <!-- 🔍 EL MODAL FORENSE -->
    <div v-if="showModal && selectedEvent" class="history-modal-overlay" @click.self="closeModal">
      <div class="history-modal-content">
        
        <div class="modal-header-img" :style="{ backgroundImage: `url(${selectedEvent.imagen_url || 'https://placehold.co/600x400/EEE/31343C?text=Fantasma'})` }">
          <div class="modal-header-overlay">
            <span class="badge bg-danger mb-2"><i class="fa-solid fa-ghost"></i> Evento Archivado</span>
            <h2 class="text-white m-0">{{ selectedEvent.nombre_evento }}</h2>
            <button class="btn-close-custom" @click="closeModal"><i class="fa-solid fa-xmark"></i></button>
          </div>
        </div>

        <!-- 👇 FIX LETRAS BLANCAS: text-dark y color forzado 👇 -->
        <div class="modal-body-custom p-4 text-dark" style="color: #212529 !important;">
          <div class="row">
            
            <div class="col-md-7 border-end pe-4">
              <h5 class="text-muted text-uppercase fw-bold" style="font-size: 0.85rem; letter-spacing: 1px;">Descripción Original</h5>
              <p class="mb-4">{{ selectedEvent.descripcion || 'Sin descripción detallada.' }}</p>
              
              <div class="info-list">
                <!-- Paracaídas por si no hay datos -->
                <p><strong><i class="fa-solid fa-map-location-dot text-primary me-2"></i> Ubicación:</strong> {{ selectedEvent.lugar_nombre || 'No especificado' }}</p>
                <p><strong><i class="fa-solid fa-calendar-day text-primary me-2"></i> Inicio:</strong> {{ formatearFechaCompleta(selectedEvent.fecha_hora_inicio) }}</p>
                <p v-if="selectedEvent.fecha_hora_fin"><strong><i class="fa-solid fa-calendar-check text-primary me-2"></i> Fin:</strong> {{ formatearFechaCompleta(selectedEvent.fecha_hora_fin) }}</p>
              </div>

              <!-- 📈 SECCIÓN DE ESTADÍSTICAS CARGADAS CON LAZY LOADING -->
              <div class="mt-4 pt-3 border-top">
                <h6 class="fw-bold mb-3"><i class="fa-solid fa-chart-line text-success"></i> Rendimiento del Evento</h6>
                
                <div v-if="loadingStats" class="text-center p-3">
                  <div class="spinner-border text-primary spinner-border-sm" role="status"></div>
                  <span class="ms-2 small">Calculando ventas...</span>
                </div>
                
                <div v-else-if="eventStats" class="stats-grid">
                  <div class="stat-box bg-light rounded p-3 text-center mb-3 border">
                    <span class="d-block text-muted small text-uppercase">Recaudación Total</span>
                    <h3 class="text-success m-0 fw-bold">{{ formatCurrency(eventStats.totalRevenue) }}</h3>
                  </div>
                  
                  <div class="progress-box">
                    <div class="d-flex justify-content-between small mb-1">
                      <span>Entradas Vendidas: <strong>{{ eventStats.totalSold }} / {{ eventStats.totalCapacity }}</strong></span>
                      <span class="fw-bold text-primary">{{ eventStats.percentage }}%</span>
                    </div>
                    <div class="progress" style="height: 10px;">
                      <div class="progress-bar bg-primary progress-bar-striped" role="progressbar" :style="{ width: eventStats.percentage + '%' }"></div>
                    </div>
                  </div>
                </div>
              </div>

            </div>

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
                  <!-- 🔥 FIX DE MONEDA ACÁ 🔥 -->
                  <span class="badge bg-success rounded-pill px-3 py-2">{{ formatCurrency(tipo.precio) }}</span>
                </li>
              </ul>
              <div v-else class="alert alert-light text-center small mt-2 border">
                <i>No hay tickets configurados.</i>
              </div>
            </div>
          </div>
        </div>

        <div class="modal-footer-custom bg-light p-3 d-flex justify-content-between align-items-center border-top">
          <small class="text-muted"><i class="fa-solid fa-circle-info"></i> Modo auditoría de solo lectura.</small>
          <div>
            <button class="btn btn-outline-secondary me-2" @click="closeModal">Cerrar Visor</button>
            <button class="btn btn-success px-4" @click="handleRestore(selectedEvent)"><i class="fa-solid fa-heart-pulse me-2"></i> Resucitar</button>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import Widget from '@/components/Widget.vue';
import VueTable from '@/components/Tables/VueTable.vue';
import FullPageLoader from '@/components/FullPageLoader.vue';

export default {
  name: 'HistorialEventos',
  components: { Widget, VueTable, FullPageLoader },
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
    
    // 🧠 NUEVOS ESTADOS PARA EL LAZY LOADING
    loadingStats: false,
    eventStats: null
  }),
  computed: {
    ...mapGetters(['archivedTickets', 'loadingHistory'])
  },
  methods: {
    ...mapActions(['fetchArchivedTickets', 'restoreEventoAction', 'fetchSingleEventStats']),

    fetchData(tableParams) {
      this.fetchArchivedTickets(tableParams);
    },

    handleKeydown(e) {
      if (e.key === 'Escape' && this.showModal) {
        this.closeModal();
      }
    },

    // 🔍 ABRE EL MODAL Y DISPARA EL LAZY LOADING
    async handleViewInfo(item) {
      this.selectedEvent = item;
      this.showModal = true;

      // Reseteamos stats y prendemos el loading
      this.eventStats = null;
      this.loadingStats = true;

      // Le pedimos al backend los cálculos a la velocidad de la luz ⚡
      const stats = await this.fetchSingleEventStats(item.evento_id);
      this.eventStats = stats;
      this.loadingStats = false;
    },

    closeModal() {
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
          await this.restoreEventoAction(item.evento_id);
          if (this.$toast) this.$toast.success('¡Evento resucitado con éxito! 🧟‍♂️✨');
          this.closeModal(); 
          this.$refs.historyTable.changed(); 
        } catch (error) {
          if (this.$toast) this.$toast.error('Hubo un error al restaurar.');
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

    // 💄 LA PELUQUERÍA PARA LOS NÚMEROS FEOS
    formatCurrency(value) {
      if (!value) return '$ 0';
      return Number(value).toLocaleString('es-AR', {
        style: 'currency',
        currency: 'ARS',
        minimumFractionDigits: 0
      });
    }
  },
  mounted() {
    // Le decimos al navegador que escuche las teclas
    document.addEventListener('keydown', this.handleKeydown);

    this.$nextTick(() => { this.$refs.historyTable?.init(); });
  },

  beforeUnmount() {
    // 🧹 Limpieza Nivel Dios: Evitamos fugas de memoria RAM
    document.removeEventListener('keydown', this.handleKeydown);
  }
};
</script>

<style scoped>
.event-thumbnail img { box-shadow: 0 2px 4px rgba(0,0,0,0.2); transition: filter 0.3s ease; }
.event-thumbnail:hover img { filter: grayscale(0%) !important; opacity: 1 !important; }

/* MODAL FORENSE */
.history-modal-overlay {
  position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
  background: rgba(15, 23, 42, 0.85); backdrop-filter: blur(4px);
  display: flex; justify-content: center; align-items: center; z-index: 9999;
  animation: fadeIn 0.2s ease-out;
}

.history-modal-content {
  background: white; width: 100%; max-width: 850px; border-radius: 12px;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1); overflow: hidden;
  animation: slideUp 0.3s ease-out;
}

.modal-header-img { height: 160px; background-size: cover; background-position: center; position: relative; }
.modal-header-overlay {
  position: absolute; top: 0; left: 0; right: 0; bottom: 0;
  background: linear-gradient(to bottom, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.9) 100%);
  padding: 1.5rem; display: flex; flex-direction: column; justify-content: flex-end; align-items: flex-start;
}

.btn-close-custom {
  position: absolute; top: 15px; right: 15px; background: rgba(255,255,255,0.2);
  border: none; color: white; width: 35px; height: 35px; border-radius: 50%;
  display: flex; align-items: center; justify-content: center; font-size: 1.2rem;
  cursor: pointer; transition: background 0.2s;
}
.btn-close-custom:hover { background: rgba(255,255,255,0.4); }

.info-list p { margin-bottom: 0.5rem; }

@keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
@keyframes slideUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
</style>