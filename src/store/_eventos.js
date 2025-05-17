// frontend/src/store/_eventos.js

export default {
  namespaced: true,
  state: () => ({
    tickets: [],
    loading: false,
    error: null,

    // Nuevas propiedades para los tipos de entrada:
    tipos: [],
    loadingTipos: false,
    errorTipos: null
  }),
  mutations: {
    SET_TICKETS(state, tickets) {
      state.tickets = tickets
    },
    SET_LOADING(state, loading) {
      state.loading = loading
    },
    SET_ERROR(state, error) {
      state.error = error
    },

    // Mutations para tipos de entrada
    SET_TIPOS(state, tipos) {
      state.tipos = tipos
    },
    SET_LOADING_TIPOS(state, loading) {
      state.loadingTipos = loading
    },
    SET_ERROR_TIPOS(state, error) {
      state.errorTipos = error
    }
  },
  actions: {
    // Listado de eventos
    async fetchTickets({ commit }) {
      commit('SET_LOADING', true)
      commit('SET_ERROR', null)
      try {
        const { data } = await this.$clients.api.get('eventos')
        commit('SET_TICKETS', data.data)
      } catch (err) {
        console.error('Error al cargar eventos:', err)
        commit('SET_ERROR', 'Error al cargar eventos')
        commit('SET_TICKETS', [])
      } finally {
        commit('SET_LOADING', false)
      }
    },

    // Nuevas actions para tipos de entrada de un evento
    async fetchTipos({ commit }, evento_id) {
      commit('SET_LOADING_TIPOS', true)
      commit('SET_ERROR_TIPOS', null)
      try {
        // asume backend expone GET /eventos/:id/tipos
        const { data } = await this.$clients.api.get(`eventos/${evento_id}/tipos`)
        commit('SET_TIPOS', data.data)
      } catch (err) {
        console.error('Error al cargar tipos de entrada:', err)
        commit('SET_ERROR_TIPOS', 'No se pudieron cargar los tipos de entrada')
        commit('SET_TIPOS', [])
      } finally {
        commit('SET_LOADING_TIPOS', false)
      }
    }
  },
  getters: {
    tickets:    state => state.tickets,
    loading:    state => state.loading,
    error:      state => state.error,

    tipos:       state => state.tipos,
    loadingTipos:state => state.loadingTipos,
    errorTipos:  state => state.errorTipos
  }
}
