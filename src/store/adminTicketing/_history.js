export default {
  state: () => ({
    archivedTickets: [],
    loadingHistory: false,
    errorHistory: null,
  }),
  
  mutations: {
    SET_ARCHIVED_TICKETS(state, tickets) {
      state.archivedTickets = tickets;
    },
    SET_LOADING_HISTORY(state, loading) {
      state.loadingHistory = loading;
    },
    SET_ERROR_HISTORY(state, error) {
      state.errorHistory = error;
    }
  },
  
  actions: {
    // 📦 1. BUSCAR EN EL SÓTANO
    async fetchArchivedTickets({ commit, getters }) {
      commit('SET_LOADING_HISTORY', true);
      commit('SET_ERROR_HISTORY', null);
      try {
        // Le avisamos al backend que queremos ver a los fantasmas con ?archivados=true
        const { data } = await this.$clients.api.get('eventos', {
          params: { archivados: true },
          headers: {
            Authorization: `Bearer ${getters.token}`
          }
        });
        commit('SET_ARCHIVED_TICKETS', data.data);
      } catch (err) {
        commit('SET_ERROR_HISTORY', 'Error al cargar el archivo histórico.');
        commit('SET_ARCHIVED_TICKETS', []);
      } finally {
        commit('SET_LOADING_HISTORY', false);
      }
    },

    // ⚡ 2. EL DESFIBRILADOR (RESTAURAR)
    async restoreEventoAction({ commit, getters, dispatch }, eventoId) {
      commit('SET_LOADING_HISTORY', true);
      try {
        // Le pegamos a la ruta especial de restaurar que armaremos en el backend
        const { data } = await this.$clients.api.put(`eventos/${eventoId}/restore`, {}, {
          headers: {
            Authorization: `Bearer ${getters.token}`
          }
        });
        
        // 🌊 TSUNAMI MODE: Refrescamos AMBAS listas
        await dispatch('fetchArchivedTickets'); // Refresca el sótano (se borra de acá)
        await dispatch('fetchTickets');         // Refresca la vidriera (vuelve a aparecer allá)
        
        return Promise.resolve(data);
      } catch (err) {
        const errorMessage = err.response?.data?.message || err.message || 'Error al restaurar el evento.';
        if (this.$errorHandler) this.$errorHandler(err);
        return Promise.reject(new Error(errorMessage));
      } finally {
        commit('SET_LOADING_HISTORY', false);
      }
    },
  },
  
  getters: {
    archivedTickets: (state) => state.archivedTickets,
    loadingHistory: (state) => state.loadingHistory,
    errorHistory: (state) => state.errorHistory,
  }
}