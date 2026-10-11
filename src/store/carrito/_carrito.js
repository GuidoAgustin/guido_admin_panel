export default {
  state: () => ({
    entradasPendientes: [],
    productosPendientes: []
  }),
  mutations: {
    SET_CARRITO_ENTRADAS(state, entradas) {
      state.entradasPendientes = entradas
    },
    SET_CARRITO_PRODUCTOS(state, productos) {
      state.productosPendientes = productos
    },
    VACIAR_CARRITO(state) {
      state.entradasPendientes = []
      state.productosPendientes = []
    }
  },
  actions: {
    // 🎟️ Acción para Pestaña Entradas
    async obtenerEntradasActivasAction({ commit, getters }) {
      try {
        const { data } = await this.$clients.api.get('carrito/entradas-activas', {
          headers: { Authorization: `Bearer ${getters.token}` }
        })
        commit('SET_CARRITO_ENTRADAS', data.data.entradasPendientes || [])
        return data.data // Devuelve entradasPendientes y entradasProximas
      } catch (error) {
        console.error('Error obteniendo entradas:', error)
        throw error
      }
    },

    // 🛍️ Acción para Pestaña Tienda
    async obtenerTiendaActivaAction({ commit, getters }) {
      try {
        const { data } = await this.$clients.api.get('carrito/tienda-activa', {
          headers: { Authorization: `Bearer ${getters.token}` }
        })
        commit('SET_CARRITO_PRODUCTOS', data.data.productosPendientes || [])
        return data.data // Devuelve productosPendientes y productosActivos
      } catch (error) {
        console.error('Error obteniendo tienda:', error)
        throw error
      }
    },

    // 📜 Acción para Pestaña Historial
    async obtenerHistorialAction({ getters }) {
      try {
        const { data } = await this.$clients.api.get('carrito/historial', {
          headers: { Authorization: `Bearer ${getters.token}` }
        })
        return data.data // Devuelve entradasPasadas y productosPasados
      } catch (error) {
        console.error('Error obteniendo historial:', error)
        throw error
      }
    },

    // Acción para el botón de pago
    async pagarOrden({ getters }, payloadDePago) {
      try {
        // Acá SÍ funciona this.$clients porque estamos adentro de Vuex
        const { data } = await this.$clients.api.post(
          'mercadopago/crear-preferencia',
          payloadDePago,
          {
            headers: {
              Authorization: `Bearer ${getters.token}`
            }
          }
        )

        // Devolvemos la info que manda Mercado Pago (el init_point)
        return data.data
      } catch (error) {
        console.error('Error al conectar con Mercado Pago:', error)
        throw error
      }
    },

   // 👇 ACCIÓN 1: Descarga Individual (Ticket)
    async descargarTicketAction({ getters }, codigo_unico) {
      try {
        // 🗺️ GPS INFALIBLE: Buscamos la variable de entorno, si falla, usamos el puerto local.
        const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:3011';
        
        const response = await fetch(`${baseUrl}/entradas_vendidases/ticket/${codigo_unico}`, {
          method: 'GET',
          headers: { Authorization: `Bearer ${getters.token}` }
        });

        if (!response.ok) throw new Error(`El servidor rebotó la conexión: ${response.status}`);

        const blob = await response.blob();
        return blob; 
      } catch (error) {
        console.error("Error al descargar ticket desde Vuex:", error);
        throw error;
      }
    },

    // 👇 ACCIÓN 2: Descarga Masiva (Toda la Orden)
    async descargarPdfOrdenAction({ getters }, orden_id) {
      try {
        // 🗺️ GPS INFALIBLE
        const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:3011';
        
        const response = await fetch(`${baseUrl}/ordenes/${orden_id}/pdf`, {
          method: 'GET',
          headers: { Authorization: `Bearer ${getters.token}` }
        });

        if (!response.ok) throw new Error(`El servidor rebotó la conexión masiva: ${response.status}`);

        // 🌊 TSUNAMI MODE: Atrapamos el binario pesado
        const blob = await response.blob();
        return blob; 
      } catch (error) {
        console.error('💥 Error al descargar PDF masivo desde Vuex:', error);
        throw error;
      }
    },

    // Le pasamos un guion bajo (_) como primer parámetro para decirle a ESLint:
    // "Sé que acá va el context, pero no lo voy a usar".
    async anularOrdenAction(_, orden_id) {
      // 🌊 TSUNAMI MODE: Limpio, directo y sin intermediarios.
      // Si esto falla, el error rebota automáticamente hacia tu MiCarrito.vue
      const response = await this.$clients.api.post(`ordenes/${orden_id}/cancelar`)
      return response.data
    }
  },

  getters: {
    cantidadTotalCarrito(state) {
      return state.entradasPendientes.length + state.productosPendientes.length
    },
    entradasEnCarrito(state) {
      return state.entradasPendientes
    },
    productosEnCarrito(state) {
      return state.productosPendientes
    }
  }
}
