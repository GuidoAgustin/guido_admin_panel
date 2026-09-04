<template>
  <div class="historial-container p-4">
    
    <!-- 🧱 LEGO 1: El Widget para el layout prolijo -->
    <Widget plain icon="fa-solid fa-box-archive">
      <template #title>
        Archivo Histórico de Eventos
      </template>
      <template #description>
        Acá descansan los eventos eliminados. Podés auditar su información o devolverlos a la plataforma activa.
      </template>

      <!-- 🧱 LEGO 2: Tu FullPageLoader para transiciones pesadas -->
      <FullPageLoader v-if="loadingHistory" />

      <!-- 🧱 LEGO 3: La joya de la corona, tu tabla inteligente -->
      <VueTable
        ref="historyTable"
        :headers="tableHeaders"
        :values="archivedTickets"
        :actions="tableActions"
        :searchMinLen="3"
        @changed="fetchData"
        @onRestore="handleRestore"
      >
        <!-- Custom slot para mostrar la fotito en gris -->
        <template #imagen="{ item }">
          <div class="event-thumbnail">
            <img 
              :src="item.imagen_url" 
              alt="Evento" 
              style="width: 60px; height: 40px; object-fit: cover; border-radius: 4px; filter: grayscale(100%); opacity: 0.8;" 
            />
          </div>
        </template>

        <!-- Custom slot para darle estilo a la fecha de borrado -->
        <template #borrado="{ item }">
          <span class="text-danger">
            <i class="fa-solid fa-skull mr-1"></i> 
            {{ formatearFecha(item.deleted_at) }}
          </span>
        </template>
      </VueTable>

    </Widget>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import Widget from '@/components/Widget.vue';
import VueTable from '@/components/Tables/VueTable.vue';
import FullPageLoader from '@/components/FullPageLoader.vue';

export default {
  name: 'HistorialEventos',
  components: {
    Widget,
    VueTable,
    FullPageLoader
  },
  data: () => ({
    // 🎛️ CONFIGURACIÓN DE LA TABLA (Arquitectura Limpia)
    tableHeaders: [
      { title: 'imagen', mask: 'Póster', slot: 'imagen', width: 10 },
      { title: 'nombre_evento', mask: 'Nombre del Evento', sortable: true },
      { title: 'lugar_nombre', mask: 'Ubicación' },
      { title: 'deleted_at', mask: 'Fecha de Baja', slot: 'borrado', sortable: true }
    ],
    tableActions: [
      {
        title: 'Restaurar Evento',
        callback: 'onRestore',
        // Opcional: si tu action soporta íconos, podés agregar icon: 'fa-solid fa-trash-restore'
      }
    ]
  }),
  computed: {
    // ⚠️ Importante: archivedTickets ahora debe tener el formato de paginación de Laravel 
    // { data: [...], current_page: 1, total: 50, etc. }
    ...mapGetters(['archivedTickets', 'loadingHistory']) 
  },
  methods: {
    ...mapActions(['fetchArchivedTickets', 'restoreEventoAction']),

    // 📡 Método que escucha a la tabla cuando el usuario busca o cambia de página
    fetchData(tableParams) {
      // tableParams trae { page, per_page, search, sort_by, sort_dir } desde VueTable.vue
      this.fetchArchivedTickets(tableParams);
    },

    async handleRestore(item) {
      // 🌊 Tsunami Mode Check: Siempre confirmar antes de escribir en DB
      const confirmacion = confirm(`¿Estás seguro de que querés restaurar el evento "${item.nombre_evento}"?`);
      
      if (confirmacion) {
        try {
          await this.restoreEventoAction(item.evento_id);
          if (this.$toast) this.$toast.success('¡Evento resucitado con éxito! 🧟‍♂️✨');
          
          // Refrescamos la tabla actual
          this.$refs.historyTable.changed(); 
        } catch (error) {
          if (this.$toast) this.$toast.error('Hubo un error al intentar restaurar el evento.');
        }
      }
    },
    
    formatearFecha(fecha) {
      if (!fecha) return '-';
      return new Date(fecha).toLocaleDateString('es-AR', {
        day: '2-digit', month: 'short', year: 'numeric'
      });
    }
  },
  mounted() {
    // Inicializamos la tabla, lo que disparará el evento @changed automáticamente
    this.$nextTick(() => {
      this.$refs.historyTable?.init();
    });
  }
};
</script>

<style scoped>
/* Un toquecito de estilo para la miniatura */
.event-thumbnail img {
  box-shadow: 0 2px 4px rgba(0,0,0,0.2);
  transition: filter 0.3s ease;
}
.event-thumbnail:hover img {
  filter: grayscale(0%) !important;
  opacity: 1 !important;
}
</style>