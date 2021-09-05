import { createStore } from "vuex";
import { getCategoryOptions } from '../service/api.js'
export default createStore({
  state: {
    isMobile: false,
    isLoading: false,
    editingItem: null,
    options: {
      type: []
    }
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
    },
    setTypeOptions (state, list = []) {
      state.options.type = list
    }
  },
  actions: {
    actSetDeviceMode(context, value) {
      context.commit('setDeviceMode', value)
    },
    actSetTypeOptions(context) {
      getCategoryOptions()
        .then(({ data }: any) => {
          context.commit('setTypeOptions', data)
        })
    }
  },
  modules: {},
})
