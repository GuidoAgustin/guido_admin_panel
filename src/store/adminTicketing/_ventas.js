// Ruta: src/store/adminTicketing/_ventas.js

export default {
  namespaced: true,

  state: () => ({
    ventas: [],
    cargandoVentas: false
  }),

  mutations: {
    SET_VENTAS(state, data) {
      state.ventas = data;
    },
    SET_LOADING(state, status) {
      state.cargandoVentas = status;
    }
  },

  actions: {
    async fetchVentasAction({ commit, rootGetters }) {
      commit('SET_LOADING', true);
      try {
        const { data } = await this.$clients.api.get('ordenes', {
          headers: { Authorization: `Bearer ${rootGetters.token}` }
        });

        // 🔥 El plato ya viene cocinado desde el Backend
        const ventasPreCocinadas = data.data || [];

        // Lo único que hace el Front-End es formatear la fecha para que se vea linda
        const ventasFinales = ventasPreCocinadas.map(venta => ({
          ...venta,
          date: venta.date ? new Date(venta.date).toLocaleDateString('es-AR') : 'Sin fecha'
        }));

        commit('SET_VENTAS', ventasFinales);
      } catch (error) {
        console.error("Error al traer las ventas:", error);
        throw error;
      } finally {
        commit('SET_LOADING', false);
      }
    }
  }
}