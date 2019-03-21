// Handle loading state
import { SET_LOADING } from '@/store/types/mutation_types'

export default {
  state: {
    isLoading: false
  },
  getters: {},
  actions: {},
  mutations: {
    [SET_LOADING](state, value) {
      // eslint-disable-next-line
      state.isLoading = value
    }
  }
}
