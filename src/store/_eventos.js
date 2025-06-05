export default {
  state: () => ({
    tickets: [],
    loading: false,
    error: null,
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
    SHOW_LOADER(state) {
      state.loading = true
    },
    HIDE_LOADER(state) {
      state.loading = false
    }
  },
  actions: {
    async fetchTickets({ commit }) {
      commit('SET_LOADING', true)
      commit('SET_ERROR', null)
      try {
        const { data } = await this.$clients.api.get('eventos')
        commit('SET_TICKETS', data.data)
      } catch (err) {
        commit('SET_ERROR', 'Error al cargar eventos')
        commit('SET_TICKETS', [])
      } finally {
        commit('SET_LOADING', false)
      }
    },
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
            if (this.$errorHandler) this.$errorHandler(err)
            reject(err)
          })
          .finally(() => {
            commit('HIDE_LOADER')
          })
      })
    },
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
            if (this.$errorHandler) this.$errorHandler(err)
            reject(err)
          })
          .finally(() => {
            commit('HIDE_LOADER')
          })
      })
    },
    async fetchTipos({ commit }, evento_id) {
      commit('SET_LOADING_TIPOS', true)
      commit('SET_ERROR_TIPOS', null)
      try {
        const { data } = await this.$clients.api.get(`eventos/${evento_id}/tipos`)
        commit('SET_TIPOS', data.data)
      } catch (err) {
        commit('SET_ERROR_TIPOS', 'No se pudieron cargar los tipos de entrada')
        commit('SET_TIPOS', [])
      } finally {
        commit('SET_LOADING_TIPOS', false)
      }
    },
    async deleteEventoAction({ commit, getters }, eventoId) {
      commit('SHOW_LOADER')
      commit('SET_ERROR', null)
      try {
        await this.$clients.api.delete(`eventos/${eventoId}`, {
          headers: {
            Authorization: `Bearer ${getters.token}`
          }
        })
        return Promise.resolve('Evento borrado exitosamente.')
      } catch (err) {
        const errorMessage =
          err.response?.data?.message || err.message || 'Error al borrar el evento.'
        commit('SET_ERROR', errorMessage)
        if (this.$errorHandler) this.$errorHandler(err)
        return Promise.reject(new Error(errorMessage))
      } finally {
        commit('HIDE_LOADER')
      }
    },
    async deleteTipoEntradaAction({ commit, getters }, tipoEntradaId) {
      commit('SET_LOADING_TIPOS', true)
      commit('SET_ERROR_TIPOS', null)
      try {
        await this.$clients.api.delete(`tipos_entradas/${tipoEntradaId}`, {
          headers: {
            Authorization: `Bearer ${getters.token}`
          }
        })
        return Promise.resolve('Tipo de entrada borrado exitosamente.')
      } catch (err) {
        const errorMessage =
          err.response?.data?.message || err.message || 'Error al borrar el tipo de entrada.'
        commit('SET_ERROR_TIPOS', errorMessage)
        if (this.$errorHandler) this.$errorHandler(err)
        return Promise.reject(new Error(errorMessage))
      } finally {
        commit('SET_LOADING_TIPOS', false)
      }
    },
    async updateEventoAction({ commit, getters }, { eventoId, eventoData }) {
      commit('SHOW_LOADER')
      commit('SET_ERROR', null)
      try {
        const { data } = await this.$clients.api.put(`eventos/${eventoId}`, eventoData, {
          headers: {
            Authorization: `Bearer ${getters.token}`
          }
        })
        return Promise.resolve(data.data)
      } catch (err) {
        const errorMessage =
          err.response?.data?.message || err.message || 'Error al actualizar el evento.'
        commit('SET_ERROR', errorMessage)
        if (this.$errorHandler) this.$errorHandler(err)
        return Promise.reject(new Error(errorMessage))
      } finally {
        commit('HIDE_LOADER')
      }
    },
    async updateTipoEntradaAction({ commit, getters }, tipoEntradaDataConId) {
      commit('SET_LOADING_TIPOS', true)
      commit('SET_ERROR_TIPOS', null)
      try {
        const tipoId = tipoEntradaDataConId.id_tipo_entrada
        if (!tipoId) {
          throw new Error('El ID del tipo de entrada es necesario para actualizar.')
        }
        const payloadToBackend = { ...tipoEntradaDataConId }
        delete payloadToBackend.id_tipo_entrada

        const { data } = await this.$clients.api.put(`tipos_entradas/${tipoId}`, payloadToBackend, {
          headers: {
            Authorization: `Bearer ${getters.token}`
          }
        })
        return Promise.resolve(data.data)
      } catch (err) {
        const errorMessage =
          err.response?.data?.message || err.message || 'Error al actualizar el tipo de entrada.'
        commit('SET_ERROR_TIPOS', errorMessage)
        if (this.$errorHandler) this.$errorHandler(err)
        return Promise.reject(new Error(errorMessage))
      } finally {
        commit('SET_LOADING_TIPOS', false)
      }
    },
    async iniciarCompraAction({ commit, getters }, payloadDeCompra) {
      commit('SHOW_LOADER')
      commit('SET_ERROR', null)
      try {
        const { data } = await this.$clients.api.post('ordenes', payloadDeCompra, {
          headers: {
            Authorization: `Bearer ${getters.token}`
          }
        })
        return Promise.resolve(data.data)
      } catch (err) {
        const errorMessage =
          err.response?.data?.message || err.message || 'Error al iniciar el proceso de compra.'
        commit('SET_ERROR', errorMessage)
        if (this.$errorHandler) {
          this.$errorHandler(err)
        }
        return Promise.reject(new Error(errorMessage))
      } finally {
        commit('HIDE_LOADER')
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
