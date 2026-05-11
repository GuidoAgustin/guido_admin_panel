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
import { mapState } from 'vuex';
import Widget from '@/components/Widget.vue';
// Asumo que <vue-table> ya está registrada globalmente como en UsersSection, 
// si no, acordate de importarla!

export default {
  name: 'SalesSection',
  components: { Widget },
  data() {
    return {
      // 🛠️ EL MANUAL DE INSTRUCCIONES DE LA TABLA
      vTable: {
        headers: [
          // Magia 1: Le ponemos pre: '#' para que agregue el numeral automático
          { title: 'id', mask: 'ID', sortable: true, pre: '#' },
          { title: 'eventName', mask: 'Evento', sortable: true },
          { title: 'customerName', mask: 'Cliente', sortable: true },
          { title: 'quantity', mask: 'Cantidad', sortable: true },
          // Magia 2: pre: '$' para el dinero
          { title: 'total', mask: 'Total', sortable: true, pre: '$' },
          { title: 'date', mask: 'Fecha', sortable: true },
          // Magia 3: Usamos un callback para escupir HTML (los badges de colores)
          { title: 'status', mask: 'Estado', sortable: true, htmlFormat: true, callback: this.formatStatus }
        ],
        options: {
          searchable: true, // ¡Buscador automático activado!
        },
        filters: [
          // Magia 4: ¡El filtro que tenías arriba ahora vive adentro de la tabla!
          {
            title: 'Filtrar por Período',
            column: 'periodo', 
            type: 'select',
            options: [
              { id: 'all', label: 'Todos los eventos' },
              { id: 'today', label: 'Hoy' },
              { id: 'week', label: 'Esta semana' },
              { id: 'month', label: 'Este mes' }
            ]
          }
        ]
      },
      lastParams: null,
      currentPage: 1,
      perPage: 15,
    }
  },
  computed: {
    ...mapState(['sales']), // Traemos tus ventas falsas por ahora
    
    // 🧠 Simulamos el objeto de paginación de Laravel para que VueTable sea feliz
    tableValues() {
      const total = this.sales ? this.sales.length : 0;
      
      // Si this.sales no es un array todavía, devolvemos el esqueleto vacío
      if (!Array.isArray(this.sales)) {
        return { total: 0, per_page: this.perPage, current_page: 1, data: [] };
      }

      return {
        total: total,
        per_page: this.perPage,
        current_page: this.currentPage,
        last_page: Math.ceil(total / this.perPage) || 1,
        from: 1,
        to: total,
        data: this.sales // Acá le inyectamos los datos reales
      }
    }
  },
  methods: {
    // 📡 VueTable nos avisa cuando alguien busca, pagina o filtra
    getData(params) {
      this.currentPage = params.page || 1;
      this.perPage = params.per_page || 15;

      // Acá en el futuro harías: this.$store.dispatch('fetchSales', params);
      console.log("🚀 VueTable pidió datos al backend con estos params:", params);
    },

    // 🎨 Esta función convierte la palabra "completado" en un globito de color HTML
    formatStatus(val) {
      if (!val) return '-';
      
      const estado = val.toLowerCase();
      let color = 'secondary';
      
      if (estado.includes('complet')) color = 'success';
      if (estado.includes('pendient')) color = 'warning';
      if (estado.includes('cancel')) color = 'danger';

      return `<span class="badge bg-${color}">${val}</span>`;
    }
  }
}
</script>

<style scoped>
/* ¡No necesitamos casi CSS porque VueTable hace el trabajo pesado! */
</style>