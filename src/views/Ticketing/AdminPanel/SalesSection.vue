<template>
  <Widget icon="fa-solid fa-file-invoice-dollar fa-lg text-success" class="bg-dark text-white border-secondary">
    <template #title>
      <span class="text-white">Historial de Ventas</span>
    </template>
    
    <vue-table
      v-if="vTable.headers"
      :values="tableValues"
      :headers="vTable.headers"
      :options="vTable.options"
      :filters="vTable.filters"
      @changed="getData"
      ref="vtable"
    />
  </Widget>
</template>

<script>
import { mapState, mapActions } from 'vuex';
import Widget from '@/components/Widget.vue';

export default {
  name: 'SalesSection',
  components: { Widget },
  data() {
    return {
      vTable: {
        headers: [
          { title: 'id', mask: 'ID', sortable: true, pre: '#' },
          { title: 'eventName', mask: 'Evento', sortable: true },
          { title: 'customerName', mask: 'Cliente', sortable: true },
          { title: 'quantity', mask: 'Cantidad', sortable: true },
          { title: 'total', mask: 'Total', sortable: true, pre: '$' },
          { title: 'date', mask: 'Fecha', sortable: true },
          { title: 'status', mask: 'Estado', sortable: true, htmlFormat: true, callback: this.formatStatus }
        ],
        options: {
          searchable: true,
        },
        filters: [
          {
            title: 'Filtrar por Estado',
            column: 'status',
            type: 'select',
            // 👇 ¡EL PASAPORTE TRIPLE! Tiene lo que pide el Select y lo que pide el Filtro.
            options: [
              { id: 'all', label: 'Todos los estados', value: 'all' },
              { id: 'pagado', label: 'Pagado', value: 'pagado' },
              { id: 'pendiente', label: 'Pendiente', value: 'pendiente' },
              { id: 'cancelado', label: 'Cancelado', value: 'cancelado' }
            ]
          }
        ]
      },
      currentPage: 1,
      perPage: 15,
      currentParams: {} // Guardamos los parámetros que emite @changed
    }
  },
  computed: {
    ...mapState({
      ventas: state => state.ventas?.ventas || [],
      cargando: state => state.ventas?.cargandoVentas || false
    }),
    
    // 🧠 CEREBRO MEJORADO: Mastica los filtros y los ordenamientos de forma exacta
    ventasFiltradas() {
      let resultado = [...this.ventas];

      // 1. Buscador Global
      if (this.currentParams.search) {
        const query = this.currentParams.search.toLowerCase();
        resultado = resultado.filter(v => 
          (v.eventName && v.eventName.toLowerCase().includes(query)) ||
          (v.customerName && v.customerName.toLowerCase().includes(query)) ||
          String(v.id).includes(query)
        );
      }

      // 2. Filtro Exacto por Estado
      const statusFilter = this.currentParams.status;
      if (statusFilter && statusFilter !== 'all') {
        resultado = resultado.filter(v => 
          v.status && v.status.toLowerCase() === statusFilter.toLowerCase()
        );
      }

      // 3. Ordenamiento Inteligente (ASC / DESC)
      if (this.currentParams.sort_by && this.currentParams.sort_dir) {
        const sortBy = this.currentParams.sort_by;
        const sortDir = this.currentParams.sort_dir === 'desc' ? -1 : 1;

        resultado.sort((a, b) => {
          let valA = a[sortBy];
          let valB = b[sortBy];

          // 👇 CORRECCIÓN CLAVE: Si es un número (precio, cantidad o id), los casteamos a Number
          if (['total', 'quantity', 'id'].includes(sortBy)) {
            valA = Number(valA);
            valB = Number(valB);
          } else if (sortBy === 'date') {
            // Si es la fecha (DD/MM/YYYY), la damos vuelta para poder ordenarla bien (YYYYMMDD)
            valA = valA ? valA.split('/').reverse().join('') : '';
            valB = valB ? valB.split('/').reverse().join('') : '';
          } else {
            // Si es texto (Cliente, Evento), pasamos a minúsculas
            valA = String(valA || '').toLowerCase();
            valB = String(valB || '').toLowerCase();
          }

          if (valA < valB) return -1 * sortDir;
          if (valA > valB) return 1 * sortDir;
          return 0;
        });
      }

      return resultado;
    },

    // 📦 EMPAQUETADOR DE LARAVEL: Le da a la tabla la info exactamente como la pide
    tableValues() {
      const total = this.ventasFiltradas.length;
      
      if (total === 0) {
        return { total: 0, per_page: this.perPage, current_page: 1, last_page: 1, from: 0, to: 0, data: [] };
      }

      const start = (this.currentPage - 1) * this.perPage;
      const end = start + this.perPage;
      const dataPaginada = this.ventasFiltradas.slice(start, end);

      return {
        total: total,
        per_page: this.perPage,
        current_page: this.currentPage,
        last_page: Math.ceil(total / this.perPage) || 1,
        from: start + 1,
        to: end > total ? total : end,
        data: dataPaginada
      }
    }
  },
  methods: {
    ...mapActions('ventas', ['fetchVentasAction']),

    // La tabla emite 'changed' y nosotros atajamos todo acá
    getData(params) {
      this.currentParams = params || {};
      this.currentPage = params.page || 1;
      this.perPage = params.per_page || 15;
    },

    formatStatus(val) {
      if (!val) return '-';
      
      const estado = val.toLowerCase();
      let color = 'secondary';
      
      if (estado.includes('pagad') || estado.includes('complet')) color = 'success';
      if (estado.includes('pendient')) color = 'warning';
      if (estado.includes('cancel') || estado.includes('fall')) color = 'danger';

      return `<span class="badge bg-${color} text-white">${val.toUpperCase()}</span>`;
    }
  },
  mounted() {
    this.fetchVentasAction();
  }
}
</script>

<style scoped>
/* ===========================================================
  🎨 EL ANTÍDOTO DEFINITIVO PARA EL FRANKENSTEIN UI 🎨
  (Pega esto en SalesSection, UsersSection y DashboardSection)
===========================================================
*/

/* 1. Oscurecemos el fondo general de la sección para dar contraste (Casi Negro) */
.sales-section, .users-section, .dashboard-section, .reports-section, .events-section {
  background-color: #101214 !important; /* Gris ultra-oscuro */
  min-height: 100vh;
  padding: 1.5rem;
}

/* 2. Forzamos estilo Oscuro Premium al Widget */
:deep(.widget),
:deep(.card),
:deep(.bg-white) {
  background-color: #1c1f23 !important; /* Gris oscuro tarjeta */
  border-color: #343a40 !important;
  color: #f8f9fa !important; /* Texto casi blanco */
}

/* 3. Matamos la barra blanca del header del Widget definitivamente */
:deep(header),
:deep(.widget-header),
:deep(.card-header) {
  background-color: transparent !important;
  color: #f8f9fa !important; /* Título casi blanco */
  border-bottom: 1px solid #343a40 !important;
}

/* 4. LA TABLA: Forzamos textos en BLANCO PURO para contraste total */
:deep(.VueTables),
:deep(table),
:deep(thead th),
:deep(tbody td) {
  color: #ffffff !important; /* Texto blanco puro */
  background-color: transparent !important;
}

/* 5. Headers de la tabla oscuros con texto blanco */
:deep(thead th) {
  background-color: #101214 !important;
  border-bottom: 2px solid #495057 !important;
  font-weight: 700;
  text-transform: uppercase;
  font-size: 0.85rem;
}

/* 6. Filas de la tabla con borde sutil */
:deep(tbody td) {
  border-bottom: 1px solid #343a40 !important;
}

/* 7. Oscurecemos el buscador y controles de la tabla */
:deep(.VueTables__search label),
:deep(.VueTables__limit label) {
  color: #ced4da !important; /* Gris claro para etiquetas */
}

:deep(.VueTables__search input),
:deep(.VueTables__limit select),
:deep(.form-control),
:deep(.form-select) {
  background-color: #101214 !important; /* Fondo input casi negro */
  color: #ffffff !important; /* Texto input blanco */
  border-color: #495057 !important;
}

:deep(.VueTables__search input:focus),
:deep(.form-control:focus) {
  border-color: var(--bs-primary) !important;
  box-shadow: 0 0 0 0.2rem rgba(var(--bs-primary-rgb), 0.25) !important;
}

/* 8. Estilo para el Paginador */
:deep(.pagination .page-link) {
  background-color: #1c1f23 !important;
  border-color: #343a40 !important;
  color: #adb5bd !important;
}
:deep(.pagination .page-item.active .page-link) {
  background-color: var(--bs-primary) !important;
  border-color: var(--bs-primary) !important;
  color: white !important;
}

/* 9. EL CARTEL DE ADVERTENCIA (Lo hacemos minimalista y legible) */
:deep(.alert-warning) {
  background-color: rgba(255, 193, 7, 0.05) !important;
  border: 1px solid #ffc107 !important;
  border-left: 5px solid #ffc107 !important;
  color: #ffc107 !important;
}

/* 10. BOTONES DE ACCIÓN EN TABLA (Les damos peso) */
:deep(.btn-outline-primary),
:deep(.btn-outline-danger) {
  background-color: rgba(255, 255, 255, 0.05); /* Fondo muy sutil */
  font-weight: bold;
}

/* 11. RESCATE DE BOTONES FANTASMAS (Filtros y Acciones) */
:deep(.VueTables .btn),
:deep(.widget .btn),
:deep(.dropdown-toggle),
:deep(td .btn),
:deep(td button),
:deep(.VueTables__filters-row button) {
  color: #ffffff !important;
  background-color: #2b3035 !important; /* Un gris intermedio para que resalte del fondo negro */
  border: 1px solid #495057 !important;
  opacity: 1 !important;
  box-shadow: 0 2px 4px rgba(0,0,0,0.2) !important;
}

/* Efecto hover brillante para que el usuario sepa que es clickeable */
:deep(.VueTables .btn:hover),
:deep(.widget .btn:hover),
:deep(.dropdown-toggle:hover),
:deep(td .btn:hover),
:deep(td button:hover) {
  background-color: var(--bs-primary) !important;
  border-color: var(--bs-primary) !important;
  color: #ffffff !important;
}

/* Forzar que los íconos (como los 3 puntitos) adentro de los botones sean blancos */
:deep(td button i),
:deep(td button svg),
:deep(.btn i) {
  color: #ffffff !important;
  fill: #ffffff !important;
}
</style>