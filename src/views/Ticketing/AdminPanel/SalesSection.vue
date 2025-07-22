<template>
  <div class="sales-section">
    <div class="section-header">
      <h2>Historial de Ventas</h2>
      <div class="filters">
        <select v-model="salesFilter" class="filter-select">
          <option value="all">Todos los eventos</option>
          <option value="today">Hoy</option>
          <option value="week">Esta semana</option>
          <option value="month">Este mes</option>
        </select>
      </div>
    </div>
    <div class="sales-table-container">
      <table class="sales-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Evento</th>
            <th>Cliente</th>
            <th>Cantidad</th>
            <th>Total</th>
            <th>Fecha</th>
            <th>Estado</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="sale in filteredSales" :key="sale.id" class="sale-row">
            <td>#{{ sale.id }}</td>
            <td>{{ sale.eventName }}</td>
            <td>{{ sale.customerName }}</td>
            <td>{{ sale.quantity }}</td>
            <td>${{ formatNumber(sale.total) }}</td>
            <td>{{ sale.date }}</td>
            <td><span class="status-badge" :class="sale.status">{{ sale.status }}</span></td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex';

export default {
name: 'SalesSection',
data() {
  return {
    salesFilter: 'all'
  }
},
computed: {
  ...mapState(['sales']),
  ...mapGetters(['formatNumber']),
  
  filteredSales() {
    // Por ahora, solo devolvemos todas las ventas.
    return this.sales;
  }
}
}
</script>

<style scoped lang="scss">
@import '@/assets/scss/_adminPanel.scss';
</style>