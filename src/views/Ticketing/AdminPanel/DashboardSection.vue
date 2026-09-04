<template>
  <div class="dashboard-section">
    <div class="dashboard-grid">
      <div class="card">
        <div class="card-header">
          <span class="card-icon">🎫</span>
          <span class="card-title">Total Entradas Vendidas</span>
        </div>
        <div class="card-value">{{ stats.totalTickets }}</div>
      </div>
      <div class="card">
        <div class="card-header">
          <span class="card-icon">💰</span>
          <span class="card-title">Ingresos Totales</span>
        </div>
        <div class="card-value">${{ formatNumber(stats.totalRevenue) }}</div>
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
          <span class="card-title">Clientes Únicos</span>
        </div>
        <div class="card-value">{{ stats.totalUsers }}</div>
      </div>
    </div>

    <div class="charts-section mt-4">
      <div class="recent-activity w-100 card p-3 shadow-sm border-0 rounded">
        <h5 class="mb-3 text-secondary">
          <i class="fa-regular fa-bell mr-2"></i> Notificaciones del Sistema
        </h5>
        
        <div class="activity-scroll-container">
          <div class="activity-list">
            <div v-for="activity in recentActivities" :key="activity.id" class="activity-item py-2 border-bottom d-flex align-items-center">
              <div class="activity-icon mr-3" style="font-size: 1.1rem;">{{ activity.icon }}</div>
              <div class="activity-content">
                <p class="mb-0 text-dark" style="font-size: 0.9rem;">{{ activity.description }}</p>
                <span class="activity-time text-muted" style="font-size: 0.8rem;">
                  <i class="fa-regular fa-clock mr-1"></i> {{ activity.time }}
                </span>
              </div>
            </div>
            
            <div v-if="recentActivities.length === 0" class="text-center text-muted p-4">
              No hay notificaciones recientes para mostrar.
            </div>

            <div class="text-center mt-3 mb-2" v-if="hayMasNotificaciones">
              <button class="btn btn-sm btn-outline-secondary rounded-pill px-4" @click="cargarMas">
                Ver más recientes
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<script>
// 1. Invitamos a todos los VIP de Vuex (incluido mapGetters)
import { mapState, mapActions, mapGetters } from 'vuex';

export default {
  name: 'DashboardSection',
  data() {
    return {
      limiteNotificaciones: 5
    }
  },
  computed: {
    ...mapState({
      ventas: state => state.ventas?.ventas || [],
      // Ya no necesitamos traer 'eventos' enteros acá para contarlos, el backend lo hace por nosotros 😎
      totalUsuariosRegistrados: state => state.usuariosAdmin?.totalUsuarios || 0
    }),
    
    // 2. Traemos el "post-it" con las estadísticas reales calculadas por Node+MySQL
    ...mapGetters(['dashboardStats']),

    // 3. Le pasamos los datos ultra limpios y ligeros a las tarjetitas
    stats() {
      return {
        totalTickets: this.dashboardStats?.totalTickets || 0,
        totalRevenue: this.dashboardStats?.totalRevenue || 0,
        activeEvents: this.dashboardStats?.activeEvents || 0,
        upcomingEvents: this.dashboardStats?.upcomingEvents || 0,
        totalUsers: this.totalUsuariosRegistrados 
      };
    },

    recentActivities() {
      return this.ventas.slice(0, this.limiteNotificaciones).map(v => {
        let icon = '⏳';
        if (v.status && v.status.toLowerCase().includes('pagad')) icon = '✅';
        if (v.status && v.status.toLowerCase().includes('cancel')) icon = '❌';

        return {
          id: v.id,
          icon: icon,
          description: `Orden #${v.id}: ${v.customerName} operó ${v.quantity} entrada(s) - ${v.eventName} [${v.status.toUpperCase()}].`,
          time: v.date
        };
      });
    },

    hayMasNotificaciones() {
      return this.ventas.length > this.limiteNotificaciones;
    }
  },
  methods: {
    // 4. Mapeamos todas las acciones necesarias de los distintos módulos
    ...mapActions('ventas', ['fetchVentasAction']),
    ...mapActions(['fetchTickets', 'fetchDashboardStats']), // <-- Acciones globales
    ...mapActions('usuariosAdmin', ['fetchTotalUsersAction']),

    formatNumber(value) {
      if (!value) return "0.00";
      return parseFloat(value).toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    },

    cargarMas() {
      this.limiteNotificaciones += 10;
    }
  },
  async mounted() {
    // 5. 🌊 TSUNAMI MODE NETWORK ACTIVADO: Promise.all
    // En lugar de esperar a que termine una petición para arrancar la otra,
    // disparamos las 4 peticiones a la API AL MISMO TIEMPO. 
    // ¡Tu dashboard va a cargar a la velocidad de la luz! ⚡
    try { 
      await Promise.all([
        this.fetchVentasAction(),
        this.fetchTickets(),
        this.fetchTotalUsersAction(),
        this.fetchDashboardStats() // Pide los numeritos del post-it
      ]);
    } catch(e) { 
      console.error("Error al cargar el Dashboard:", e); 
    }
  }
}
</script>

<style scoped lang="scss">
@import '@/assets/scss/_adminPanel.scss';

.w-100 {
  width: 100%;
}

.activity-scroll-container {
  max-height: 300px;
  overflow-y: auto;
  padding-right: 10px;
  
  &::-webkit-scrollbar {
    width: 6px;
  }
  &::-webkit-scrollbar-track {
    background: #f1f1f1; 
    border-radius: 4px;
  }
  &::-webkit-scrollbar-thumb {
    background: #c1c1c1; 
    border-radius: 4px;
  }
  &::-webkit-scrollbar-thumb:hover {
    background: #a8a8a8; 
  }
}
</style>