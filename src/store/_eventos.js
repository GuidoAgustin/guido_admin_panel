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
      commit('SHOW_LOADER') // O por ejemplo commit('SET_LOADING_TIPOS', true);
      commit('SET_ERROR_TIPOS', null)
      try {
        // La ruta en backend/app/routes/tipos_entradas.router.js es /tipos_entradas/:tipos_entrada_id
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
        if (this.$errorHandler) {
          this.$errorHandler(err)
        }
        return Promise.reject(new Error(errorMessage))
      } finally {
        commit('HIDE_LOADER') // O por ejemplo commit('SET_LOADING_TIPOS', false);
      }
    },

    async updateEventoAction({ commit, getters }, { eventoId, eventoData }) {
      // eventoData se espera que sea un objeto FormData si incluye un archivo,
      // o un objeto plano si no (aunque el backend podría esperar FormData siempre si usa imageMiddleware).
      // El ModalForm.vue deberá preparar eventoData como FormData si hay una imagen.
      commit('SHOW_LOADER') // Usar un loader general o uno específico para "guardando evento"
      commit('SET_ERROR', null)
      try {
        // La API espera un PUT a /eventos/:evento_id
        // this.$clients.api debería estar configurado para manejar FormData si es necesario
        const { data } = await this.$clients.api.put(`eventos/${eventoId}`, eventoData, {
          headers: {
            Authorization: `Bearer ${getters.token}` // Asumiendo que tienes un getter 'token'
            // 'Content-Type': 'multipart/form-data' // Axios lo maneja automáticamente con FormData
          }
        })

        // Opcional: Actualizar el evento en el estado local 'tickets'
        // Esto puede ser complejo si la estructura es profunda.
        // commit('UPDATE_EVENTO_IN_LIST', data.data); // Necesitarías una mutación para esto

        // Por lo general, es más fácil que el componente que llama a esta acción
        // luego recargue la lista de tickets o el detalle del evento.
        // El ModalForm emitirá 'eventSaved' que ya dispara 'fetchTickets' en Ticketing.vue

        return Promise.resolve(data.data) // Devuelve el evento actualizado
      } catch (err) {
        const errorMessage =
          err.response?.data?.message || err.message || 'Error al actualizar el evento.'
        commit('SET_ERROR', errorMessage)
        if (this.$errorHandler) {
          this.$errorHandler(err)
        }
        return Promise.reject(new Error(errorMessage))
      } finally {
        commit('HIDE_LOADER')
      }
    },

    async updateTipoEntradaAction({ commit, getters }, tipoEntradaData) {
      // tipoEntradaData es un objeto JS que incluye id_tipo_entrada y los campos a actualizar.
      commit('SET_LOADING_TIPOS', true) // Usar loader/error específico para tipos
      commit('SET_ERROR_TIPOS', null)
      try {
        const tipoId = tipoEntradaData.id_tipo_entrada
        if (!tipoId) {
          throw new Error('El ID del tipo de entrada es necesario para actualizar.')
        }

        // La API espera un PUT a /tipos_entradas/:tipos_entrada_id
        // El payload para PUT debería ser solo los campos a actualizar,
        // pero tu backend controller para tipos_entradas toma todos los campos del body.
        const payload = { ...tipoEntradaData }
        delete payload.id_tipo_entrada // No enviar el ID en el cuerpo del payload si la API lo toma de la URL

        const { data } = await this.$clients.api.put(`tipos_entradas/${tipoId}`, payload, {
          headers: {
            Authorization: `Bearer ${getters.token}`
          }
        })

        // Opcional: Actualizar el tipo de entrada en el estado local 'tipos' o dentro de un evento en 'tickets'
        // commit('UPDATE_TIPO_ENTRADA', data.data); // Necesitarías una mutación para esto

        return Promise.resolve(data.data) // Devuelve el tipo de entrada actualizado
      } catch (err) {
        const errorMessage =
          err.response?.data?.message || err.message || 'Error al actualizar el tipo de entrada.'
        commit('SET_ERROR_TIPOS', errorMessage)
        if (this.$errorHandler) {
          this.$errorHandler(err)
        }
        return Promise.reject(new Error(errorMessage))
      } finally {
        commit('SET_LOADING_TIPOS', false)
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
