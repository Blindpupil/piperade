import {
  isEmpty,
  isArray,
  values
} from 'lodash-es'
import { usersColRef } from '@/firebase'
import createPantry from '@/store/models/Pantry'
import { WRITE_CUPBOARDS, GET_CUPBOARDS } from '@/store/types/action_types'
import { SET_CUPBOARDS } from '@/store/types/mutation_types'

export default {
  state: {
    cupboards: []
  },
  getters: {
    cupboards: state => state.cupboards
  },
  actions: {
    async [WRITE_CUPBOARDS]({ commit }, cupboardItems) {
      try {
        // TODO: create User module
        const currentUser = 'user1'

        const pantry = createPantry(cupboardItems)

        await usersColRef.doc(currentUser).collection('eadables').doc('pantry').set(pantry)

        commit(SET_CUPBOARDS, cupboardItems)
      } catch (err) {
        console.error(err)
      }
    },
    async [GET_CUPBOARDS]({ commit }) {
      try {
        const currentUser = 'user1'

        usersColRef.doc(currentUser).collection('eadables').doc('pantry').onSnapshot((doc) => {
          const data = doc.data() || {}
          if (!isEmpty(data)) {
            commit(SET_CUPBOARDS, data)
          }
        })
      } catch (err) {
        console.error(err)
      }
    }
  },
  mutations: {
    [SET_CUPBOARDS](state, cupboardItems) {
      if (isArray(cupboardItems)) {
        // eslint-disable-next-line
        state.cupboards = [...cupboardItems]
      } else {
        const cupboardItemsArr = values(cupboardItems)
        // eslint-disable-next-line
        state.cupboards = [...cupboardItemsArr]
      }
    }
  }
}
