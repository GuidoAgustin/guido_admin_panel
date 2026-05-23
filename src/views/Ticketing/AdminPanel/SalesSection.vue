<template>
  <Widget icon="fa-solid fa-file-invoice-dollar fa-lg text-success" class="sales-section">
    <template #title>Historial de Ventas</template>
    
    <!-- 👇 Nuestra Navaja Suiza en acción 👇 -->
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
/* ¡No necesitamos casi CSS porque VueTable hace el trabajo pesado! */
</style>