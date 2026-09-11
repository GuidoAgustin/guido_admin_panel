export default {
  namespaced: true, 

  state: () => ({
    reports: {
      monthlyRevenue: 0,
      averageSale: 0,
      topEvent: 'N/A',
      completedEvents: 0,
      averageOccupancy: 0,
      cancellations: 0
    },
    cargandoReportes: false,
    
    // 👇 NUEVO: Guardamos la lista de eventos en el estado global
    eventosParaFiltro: [] 
  }),

  mutations: {
    SET_REPORTS(state, data) {
      state.reports = data;
    },
    SET_LOADING(state, status) {
      state.cargandoReportes = status;
    },
    // 👇 NUEVO: Mutación para guardar la lista
    SET_EVENTOS_FILTRO(state, eventos) {
      state.eventosParaFiltro = eventos;
    }
  },

  actions: {
    // 🛡️ Clean Architecture: La acción del Sabueso Inteligente
   // 🛡️ Clean Architecture: La acción del Sabueso Inteligente (Versión Axios)
    async fetchEventosFiltroAction({ commit, state }) {
      // 🌊 Tsunami Mode (Caché): Si ya los cargamos, no volvemos a golpear la DB
      if (state.eventosParaFiltro.length > 1) return; 

      try {
        // En vez de desestructurar con { data }, agarramos la respuesta completa
        const response = await this.$clients.api.get('eventos');
        const payload = response.data;

        // 🐶 EL SABUESO NINJA (Clean Code de alta gama)
        // Metemos todas las posibles ubicaciones en una lista y buscamos la primera que sea un Array real.
        const sospechosos = [payload, payload?.data?.data, payload?.data, payload?.rows];
        const eventosReales = sospechosos.find(Array.isArray) || [];

        if (eventosReales.length === 0) {
          console.warn("⚠️ El sabueso no encontró el Array:", payload);
        }

        const listaFinal = [
          { evento_id: '', nombre_evento: 'Todos los eventos' },
          ...eventosReales
        ];

        commit('SET_EVENTOS_FILTRO', listaFinal);
      } catch (error) {
        console.error("🔥 Error en Vuex cargando eventos para el filtro:", error);
        commit('SET_EVENTOS_FILTRO', [{ evento_id: '', nombre_evento: 'Todos los eventos' }]);
      }
    },

    async fetchReportesAction({ commit, rootGetters }, { start, end, id_evento }) {
      commit('SET_LOADING', true);
      try {
        const queryParams = {};
        if (start) queryParams.start = start;
        if (end) queryParams.end = end;
        if (id_evento) queryParams.id_evento = id_evento;

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