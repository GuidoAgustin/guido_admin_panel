export default {
  namespaced: true,
  state: () => ({
    totalUsuarios: 0
  }),
  mutations: {
    SET_TOTAL_USUARIOS(state, total) {
      state.totalUsuarios = total;
    }
  },
  actions: {
    async fetchTotalUsersAction({ commit, rootGetters }) {
      try {
        // Usamos rootGetters.token para leer el token del módulo auth
        const { data } = await this.$clients.api.get('users?per_page=1', {
          headers: { Authorization: `Bearer ${rootGetters.token}` }
        });
        
        const total = data.data?.total || 0;
        commit('SET_TOTAL_USUARIOS', total);
        
        return total;
      } catch (error) {
        console.error("Error al traer total de usuarios:", error);
        return 0;
      }
    }
  }
}