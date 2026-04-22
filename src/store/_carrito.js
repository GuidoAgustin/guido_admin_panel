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
    // Definimos la función de forma clásica para no perder el 'this'
    async obtenerCarritoPendiente({ commit, getters }) {
      try {
        // Usamos tu cliente oficial de Axios (igual que en eventos)
        const { data } = await this.$clients.api.get('carrito/mis-compras', {
          headers: {
            Authorization: `Bearer ${getters.token}` // Asumiendo que tenés un getter 'token' en auth
          }
        });

        // Extraemos la información que armó el Backend
        const misDatos = data.data;

        // Guardamos en el Store solo lo que está pendiente de pago
        commit('SET_CARRITO_ENTRADAS', misDatos.entradasPendientes || []);
        commit('SET_CARRITO_PRODUCTOS', misDatos.productosPendientes || []);

        // Devolvemos todos los datos para que el componente armé el historial
        return misDatos;

      } catch (error) {
        console.error("Error al obtener carrito:", error);
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