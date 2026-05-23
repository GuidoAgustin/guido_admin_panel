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
        // Hacemos el llamado a tu controlador de Órdenes.
        // ⚠️ Asegurate de que la ruta coincida con tu backend (ej: '/ordenes' o '/ticketing/ordenes')
        const { data } = await this.$clients.api.get('ordenes', {
          headers: { Authorization: `Bearer ${rootGetters.token}` }
        });

        const ordenesCrudas = data.data || [];

        // 🧠 MAPEO MAGICO: Transformamos los datos del backend al formato exacto de VueTable
        const ventasMapeadas = ordenesCrudas.map(orden => {
          
          // Sacamos el nombre del evento (buscamos en el primer ítem de la orden)
          let nombreEvento = 'Evento Desconocido';
          if (orden.itemsDeOrden && orden.itemsDeOrden.length > 0) {
            const primerItem = orden.itemsDeOrden[0];
            if (primerItem.tipoEntrada && primerItem.tipoEntrada.eventoInfo) {
              nombreEvento = primerItem.tipoEntrada.eventoInfo.nombre_evento;
            }
          }

          // Armamos el nombre del cliente atajando cualquier nombre de columna que uses
          const comprador = orden.comprador || {};
          const nombreCliente = `${comprador.nombre || comprador.first_name || ''} ${comprador.apellido || comprador.last_name || ''}`.trim() || comprador.email || 'Anónimo';

          return {
            id: orden.id_orden,
            eventName: nombreEvento,
            customerName: nombreCliente,
            quantity: orden.itemsDeOrden ? orden.itemsDeOrden.length : 0,
            total: parseFloat(orden.monto_total || 0).toFixed(2), // Lo dejamos lindo con 2 decimales
            date: new Date(orden.fecha_orden).toLocaleDateString('es-AR'), // Formato DD/MM/YYYY
            status: orden.estado_pago || 'Desconocido'
          };
        });

        commit('SET_VENTAS', ventasMapeadas);
      } catch (error) {
        console.error("Error al traer las ventas:", error);
        throw error;
      } finally {
        commit('SET_LOADING', false);
      }
    }
  }
}