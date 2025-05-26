// frontend/src/store/_eventos.js

export default {
  state: () => ({
    tickets: [],
    loading: false,
    error: null,

    // Para el modal de compra
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
    SET_TIPOS(state, tipos) {
      state.tipos = tipos
    },
    SET_LOADING_TIPOS(state, loading) {
      state.loadingTipos = loading
    },
    SET_ERROR_TIPOS(state, error) {
      state.errorTipos = error
    },
    // Para mostrar/ocultar loader en acciones de creación
    SHOW_LOADER(state) {
      state.loading = true
    },
    HIDE_LOADER(state) {
      state.loading = false
    }
  },
  actions: {
    // Listar eventos
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

    // Crear evento con formato de updateProfile
    createEvento({ commit, getters }, form) {
      commit('SHOW_LOADER')
      return new Promise((resolve, reject) => {
        this.$clients.api
          .post('eventos', form, {
            headers: {
              Authorization: `Bearer ${getters.token}`
            }
          })
          .then(({ data }) => {
            resolve(data)
          })
          .catch((err) => {
            this.$errorHandler(err)
            reject(err)
          })
          .finally(() => {
            commit('HIDE_LOADER')
          })
      })
    },

    // Crear tipo de entrada con formato de updateProfile
    createTipo({ commit, getters }, form) {
      commit('SHOW_LOADER')
      return new Promise((resolve, reject) => {
        this.$clients.api
          .post('tipos_entradas', form, {
            headers: {
              Authorization: `Bearer ${getters.token}`
            }
          })
          .then(({ data }) => {
            resolve(data)
          })
          .catch((err) => {
            this.$errorHandler(err)
            reject(err)
          })
          .finally(() => {
            commit('HIDE_LOADER')
          })
      })
    },

    // Listar tipos de entrada de un evento
    async fetchTipos({ commit }, evento_id) {
      commit('SET_LOADING_TIPOS', true)
      commit('SET_ERROR_TIPOS', null)
      try {
        const { data } = await this.$clients.api.get(`eventos/${evento_id}/tipos`)
        commit('SET_TIPOS', data.data)
      } catch (err) {
        console.error('Error al cargar tipos de entrada:', err)
        commit('SET_ERROR_TIPOS', 'No se pudieron cargar los tipos de entrada')
        commit('SET_TIPOS', [])
      } finally {
        commit('SET_LOADING_TIPOS', false)
      }
    },

    // ACCIÓN NUEVA PARA BORRAR EVENTO
    async deleteEventoAction({ commit, getters }, eventoId) {
      commit('SHOW_LOADER')
      commit('SET_ERROR', null)
      try {
        await this.$clients.api.delete(`eventos/${eventoId}`, {
          headers: {
            Authorization: `Bearer ${getters.token}` // Asegúrate que el token se obtiene correctamente
          }
        })
        return Promise.resolve('Evento borrado exitosamente.')
      } catch (err) {
        // Extraer mensaje de error de la respuesta del backend si está disponible
        const errorMessage =
          err.response?.data?.message || err.message || 'Error al borrar el evento.'
        commit('SET_ERROR', errorMessage)
        // Asumiendo que tienes un manejador global de errores que puede mostrar mensajes
        if (this.$errorHandler) {
          this.$errorHandler(err)
        }
        return Promise.reject(new Error(errorMessage)) // Rechazar con el mensaje de error
      } finally {
        commit('HIDE_LOADER')
      }
    },
    // ACCIÓN NUEVA PARA BORRAR TIPO DE ENTRADA
    async deleteTipoEntradaAction({ commit, getters }, tipoEntradaId) {
      // Considera usar un estado de carga/error específico para tipos si es necesario
      commit('SHOW_LOADER'); // O por ejemplo commit('SET_LOADING_TIPOS', true);
      commit('SET_ERROR_TIPOS', null);
      try {
        // La ruta en backend/app/routes/tipos_entradas.router.js es /tipos_entradas/:tipos_entrada_id
        await this.$clients.api.delete(`tipos_entradas/${tipoEntradaId}`, {
          headers: {
            Authorization: `Bearer ${getters.token}`
          }
        });
        return Promise.resolve('Tipo de entrada borrado exitosamente.');
      } catch (err) {
        const errorMessage = err.response?.data?.message || err.message || 'Error al borrar el tipo de entrada.';
        commit('SET_ERROR_TIPOS', errorMessage);
        if (this.$errorHandler) {
            this.$errorHandler(err);
        }
        return Promise.reject(new Error(errorMessage));
      } finally {
        commit('HIDE_LOADER'); // O por ejemplo commit('SET_LOADING_TIPOS', false);
      }
    }
  },
  getters: {
    tickets: (state) => state.tickets,
    loading: (state) => state.loading,
    error: (state) => state.error,

    tipos: (state) => state.tipos,
    loadingTipos: (state) => state.loadingTipos,
    errorTipos: (state) => state.errorTipos
  }
}
