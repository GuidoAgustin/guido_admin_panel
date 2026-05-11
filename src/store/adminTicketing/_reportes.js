// Ruta: src/store/adminTicketing/_reportes.js

export default {
  namespaced: true, // 👈 ¡MAGIA! Aísla este archivo del resto

  state: () => ({
    reports: {
      monthlyRevenue: 0,
      averageSale: 0,
      topEvent: 'N/A',
      completedEvents: 0,
      averageOccupancy: 0,
      cancellations: 0
    },
    cargandoReportes: false
  }),

  mutations: {
    SET_REPORTS(state, data) {
      state.reports = data;
    },
    SET_LOADING(state, status) {
      state.cargandoReportes = status;
    }
  },

  actions: {
    // 👇 1. Agregamos id_evento para que lo reciba correctamente
    async fetchReportesAction({ commit, rootGetters }, { start, end, id_evento }) {
      commit('SET_LOADING', true);
      try {
        const queryParams = {};
        if (start) queryParams.start = start;
        if (end) queryParams.end = end;
        
        // 👇 2. Lo sumamos a la URL si es que el usuario eligió uno
        if (id_evento) queryParams.id_evento = id_evento;

        // Vamos a buscar los datos usando el token del usuario que está en el core/_auth
        const { data } = await this.$clients.api.get('admin/reportes', {
          params: queryParams,
          headers: { Authorization: `Bearer ${rootGetters.token}` }
        });

        commit('SET_REPORTS', data.data);
      } catch (error) {
        console.error("Error al traer reportes desde el backend:", error);
        throw error;
      } finally {
        commit('SET_LOADING', false);
      }
    }
  }
}