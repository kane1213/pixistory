import { createStore } from "vuex";

export default createStore({
  state: {
    isMobile: false,
    isLoading: false
  },
  mutations: {
    setDeviceMode(state, value) {
      state.isMobile = value
    },
    setLoadingStatus (state, value) {
      state.isLoading = value
    }
  },
  actions: {
    actSetDeviceMode(context, value) {
      context.commit('setDeviceMode', value)
    }
  },
  modules: {}
})
