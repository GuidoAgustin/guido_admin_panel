export default {
  state: () => ({
    entradasPendientes: [],
    productosPendientes: []
  }),
  mutations: {
    SET_CARRITO_ENTRADAS(state, entradas) {
      state.entradasPendientes = entradas;
    },
    SET_CARRITO_PRODUCTOS(state, productos) {
      state.productosPendientes = productos;
    },
    VACIAR_CARRITO(state) {
      state.entradasPendientes = [];
      state.productosPendientes = [];
    }
  },
  actions: {
    // 🎟️ Acción para Pestaña Entradas
    async obtenerEntradasActivasAction({ commit, getters }) {
      try {
        const { data } = await this.$clients.api.get('carrito/entradas-activas', {
          headers: { Authorization: `Bearer ${getters.token}` }
        });
        commit('SET_CARRITO_ENTRADAS', data.data.entradasPendientes || []);
        return data.data; // Devuelve entradasPendientes y entradasProximas
      } catch (error) {
        console.error("Error obteniendo entradas:", error);
        throw error;
      }
    },

    // 🛍️ Acción para Pestaña Tienda
    async obtenerTiendaActivaAction({ commit, getters }) {
      try {
        const { data } = await this.$clients.api.get('carrito/tienda-activa', {
          headers: { Authorization: `Bearer ${getters.token}` }
        });
        commit('SET_CARRITO_PRODUCTOS', data.data.productosPendientes || []);
        return data.data; // Devuelve productosPendientes y productosActivos
      } catch (error) {
        console.error("Error obteniendo tienda:", error);
        throw error;
      }
    },

    // 📜 Acción para Pestaña Historial
    async obtenerHistorialAction({ getters }) {
      try {
        const { data } = await this.$clients.api.get('carrito/historial', {
          headers: { Authorization: `Bearer ${getters.token}` }
        });
        return data.data; // Devuelve entradasPasadas y productosPasados
      } catch (error) {
        console.error("Error obteniendo historial:", error);
        throw error;
      }
    },

    // Acción para el botón de pago
    async pagarOrden({ getters }, payloadDePago) {
      try {
        // Acá SÍ funciona this.$clients porque estamos adentro de Vuex
        const { data } = await this.$clients.api.post('mercadopago/crear-preferencia', payloadDePago, {
          headers: {
            Authorization: `Bearer ${getters.token}`
          }
        });
        
        // Devolvemos la info que manda Mercado Pago (el init_point)
        return data.data;
      } catch (error) {
        console.error("Error al conectar con Mercado Pago:", error);
        throw error;
      }
    },

   // 👇 LA MAGIA: CADETE BYPASS PARA ARCHIVOS BINARIOS 📦 👇
    async descargarTicketAction({ getters }, codigo_unico) {
      try {
        // 1. Armamos la ruta (usando tu variable de entorno si existe)
        const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:3011';
        
        // 2. Mandamos al cadete (Fetch), pero le damos la credencial de seguridad de Vuex! 🛡️
        const response = await fetch(`${baseUrl}/entradas_vendidases/ticket/${codigo_unico}`, {
          method: 'GET',
          headers: { 
            // Esto es importantísimo: mantenemos la seguridad igual que con Axios
            'Authorization': `Bearer ${getters.token}` 
          }
        });

        // 3. Atajamos cualquier problema de red
        if (!response.ok) {
          throw new Error(`El patovica rebotó la conexión: ${response.status}`);
        }

        // 4. Transformamos la respuesta en el paquete cerrado
        const blob = await response.blob();
        return blob; 

      } catch (error) {
        console.error("Error al descargar ticket desde Vuex:", error);
        throw error;
      }
    }
  },
  
  getters: {
    cantidadTotalCarrito(state) {
      return state.entradasPendientes.length + state.productosPendientes.length;
    },
    entradasEnCarrito(state) {
      return state.entradasPendientes;
    },
    productosEnCarrito(state) {
      return state.productosPendientes;
    }
  }
}