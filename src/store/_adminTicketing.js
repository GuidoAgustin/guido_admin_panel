// Este state contiene todos los datos que antes estaban en AdminPanel.vue
const state = {
    stats: {
      totalTickets: 1247,
      ticketsGrowth: 12.5,
      totalRevenue: 89500,
      revenueGrowth: 18.3,
      activeEvents: 8,
      upcomingEvents: 3,
      totalUsers: 456,
      newUsers: 12
    },
    recentActivities: [
      { id: 1, icon: '🎫', description: 'Nueva venta: 3 entradas para "Conferencia de Tecnología"', time: 'Hace 5 min' },
      { id: 2, icon: '👤', description: 'Nuevo usuario registrado: Maria González', time: 'Hace 12 min' },
      { id: 3, icon: '📅', description: 'Evento "Festival Christian" finalizado exitosamente', time: 'Hace 1 hora' },
      { id: 4, icon: '💰', description: 'Pago procesado: $25,123 - Conferencia de Tecnología', time: 'Hace 2 horas' }
    ],
    events: [
      { id: 1, title: 'Conferencia de Tecnología', description: 'Evento de tecnología e innovación.', image: 'https://via.placeholder.com/300x200/4CAF50/ffffff?text=TECH', date: '17 may 2025, 23:25', location: 'Centro de Convenciones, Avenida Tech 456', price: 25123, status: 'activo', soldTickets: 145, totalTickets: 200 },
      { id: 2, title: 'Festival Christian', description: 'Festival musical cristiano.', image: 'https://via.placeholder.com/300x200/9C27B0/ffffff?text=MUSIC', date: '2 jun 2025, 14:34', location: 'Avellaneda, josdfgjdf', price: 25000, status: 'pasado', soldTickets: 180, totalTickets: 180 }
    ],
    sales: [
      { id: 1001, eventName: 'Conferencia de Tecnología', customerName: 'Juan Pérez', quantity: 2, total: 50246, date: '23/06/2025', status: 'completado' },
      { id: 1002, eventName: 'Festival Christian', customerName: 'Ana García', quantity: 1, total: 25000, date: '22/06/2025', status: 'completado' },
      { id: 1003, eventName: 'Conferencia de Tecnología', customerName: 'Carlos López', quantity: 3, total: 75369, date: '22/06/2025', status: 'pendiente' },
      { id: 1004, eventName: 'Festival Christian', customerName: 'María González', quantity: 4, total: 100000, date: '21/06/2025', status: 'completado' }
    ],
    users: [
      { id: 1, name: 'Juan Pérez', email: 'juan@email.com', role: 'Cliente', ticketsPurchased: 12, totalSpent: 45000 },
      { id: 2, name: 'Ana García', email: 'ana@email.com', role: 'Cliente VIP', ticketsPurchased: 25, totalSpent: 120000 },
      { id: 3, name: 'Carlos López', email: 'carlos@email.com', role: 'Cliente', ticketsPurchased: 8, totalSpent: 28000 },
      { id: 4, name: 'María González', email: 'maria@email.com', role: 'Organizador', ticketsPurchased: 5, totalSpent: 15000 }
    ],
    reports: {
      monthlyRevenue: 289500,
      averageSale: 45750,
      topEvent: 'Conferencia de Tecnología',
      completedEvents: 12,
      averageOccupancy: 87,
      cancellations: 3
    }
  };
  
  // Los getters nos permiten acceder al state y también crear funciones reutilizables
  const getters = {
    // Centralizamos la función para formatear números aquí
    formatNumber: () => (num) => {
      if (typeof num !== 'number') return num;
      return num.toLocaleString('es-AR');
    }
  };
  
  const actions = {
    // En el futuro, aquí irán las llamadas a tu API
  };
  
  const mutations = {
    // En el futuro, aquí se actualizará el state con los datos de la API
  };
  
  export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
  };