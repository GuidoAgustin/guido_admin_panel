export default {
  state: {
    loader_active: false
  },
  mutations: {
    SHOW_LOADER(state) {
      state.loader_active = true
    },
    HIDE_LOADER(state) {
      state.loader_active = false
    }
  },
  getters: {
    loader_active: (state) => state.loader_active
  }
}
