import { createStore } from "vuex";

export default createStore({
  state: {
    isMobile: false
  },
  mutations: {
    setDeviceMode(state, value) {
      state.isMobile = value
    }
  },
  actions: {
    actSetDeviceMode(context, value) {
      context.commit('setDeviceMode', value)
    }
  },
  modules: {}
})