// Handle errors and alerts
import {
  CLEAR_ERROR,
  SET_ERROR,
  SET_SUCCESS
} from '@/store/types/mutation_types'

export default {
  state: {
    error: { code: '', message: '' },
    success: ''
  },
  getters: {
    message: state => state.error.message
  },
  actions: {},
  mutations: {
    [SET_SUCCESS](state, message) {
      // eslint-disable-next-line
      state.success = message
    },
    [CLEAR_ERROR](state) {
      // eslint-disable-next-line
      state.error = {}
    },
    [SET_ERROR](state, error) {
      // eslint-disable-next-line
      state.error = error
    }
  }
}
