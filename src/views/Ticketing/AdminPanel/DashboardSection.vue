<template>
  <div class="dashboard-section">
    <div class="dashboard-grid">
      <div class="card">
        <div class="card-header">
          <span class="card-icon">🎫</span>
          <span class="card-title">Total Entradas Vendidas</span>
        </div>
        <div class="card-value">{{ stats.totalTickets }}</div>
        <div class="card-change positive">
          <span>+{{ stats.ticketsGrowth }}% este mes</span>
        </div>
      </div>
      <div class="card">
        <div class="card-header">
          <span class="card-icon">💰</span>
          <span class="card-title">Ingresos Totales</span>
        </div>
        <div class="card-value">${{ formatNumber(stats.totalRevenue) }}</div>
        <div class="card-change positive">
          <span>+{{ stats.revenueGrowth }}% este mes</span>
        </div>
      </div>
      <div class="card">
        <div class="card-header">
          <span class="card-icon">📅</span>
          <span class="card-title">Eventos Activos</span>
        </div>
        <div class="card-value">{{ stats.activeEvents }}</div>
        <div class="card-change">
          <span>{{ stats.upcomingEvents }} próximos</span>
        </div>
      </div>
      <div class="card">
        <div class="card-header">
          <span class="card-icon">👥</span>
          <span class="card-title">Usuarios Registrados</span>
        </div>
        <div class="card-value">{{ stats.totalUsers }}</div>
        <div class="card-change positive">
          <span>+{{ stats.newUsers }} nuevos hoy</span>
        </div>
      </div>
    </div>
    <div class="charts-section">
      <div class="chart-card">
        <h3>Ventas de los Últimos 7 Días</h3>
        <canvas ref="salesChart" width="400" height="200"></canvas>
      </div>
      <div class="recent-activity">
        <h3>Actividad Reciente</h3>
        <div class="activity-list">
          <div v-for="activity in recentActivities" :key="activity.id" class="activity-item">
            <div class="activity-icon">{{ activity.icon }}</div>
            <div class="activity-content">
              <p>{{ activity.description }}</p>
              <span class="activity-time">{{ activity.time }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex';

export default {
  name: 'DashboardSection',
  computed: {
    // Mapea los datos del state del módulo 'admin' a propiedades locales
    ...mapState('adminTicketing', ['stats', 'recentActivities']),
    // Mapea la función para formatear números desde los getters
    ...mapGetters('adminTicketing', ['formatNumber'])
  },
  mounted() {
    // Aquí puedes inicializar el gráfico de Chart.js usando this.$refs.salesChart
    console.log("Componente de Dashboard montado y leyendo desde Vuex.");
  }
}
</script>

<style scoped lang="scss">
@import '@/assets/scss/_adminPanel.scss';
</style>