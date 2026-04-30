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
    // La que ya teníamos...
    async obtenerCarritoPendiente({ commit, getters }) {
      try {
        const { data } = await this.$clients.api.get('carrito/mis-compras', {
          headers: { Authorization: `Bearer ${getters.token}` }
        });
        const misDatos = data.data;
        commit('SET_CARRITO_ENTRADAS', misDatos.entradasPendientes || []);
        commit('SET_CARRITO_PRODUCTOS', misDatos.productosPendientes || []);
        return misDatos;
      } catch (error) {
        console.error("Error al obtener carrito:", error);
        throw error;
      }
    },

    // 👇 AGREGAMOS ESTA NUEVA ACCIÓN PARA EL BOTÓN DE PAGO 👇
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