import { createStore } from "vuex";

export default createStore({
  state: {
    isMobile: false,
    isLoading: false,
    editingItem: null
  },
  mutations: {
    setDeviceMode(state, value) {
      state.isMobile = value
    },
    setLoadingStatus (state, value) {
      state.isLoading = value
    },
    setEditingItem (state, value = null) {
      state.editingItem = value
    }
  },
  actions: {
    actSetDeviceMode(context, value) {
      context.commit('setDeviceMode', value)
    }
  },
  modules: {}
})
