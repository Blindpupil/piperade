import { isEmpty, values } from 'lodash-es'
import { deleteField, pantryDocRef } from '@/firebase'
import { createPantryKey, createPantry } from '@/store/models/Pantry'
import {
  WRITE_CUPBOARDS,
  GET_CUPBOARDS,
  DELETE_CUPBOARD
} from '@/store/types/action_types'
import { SET_CUPBOARDS } from '@/store/types/mutation_types'

export default {
  state: {
    cupboards: [],
    unitsList: ['cloves', 'units', 'cl', 'g', 'k', 'l', 'ts', 'tbs', 'ml', 'oz']
  },
  getters: {
    cupboards: state => state.cupboards,
    unitsList: state => state.unitsList
  },
  actions: {
    // Handles both single and arrays of cupboard items
    async [WRITE_CUPBOARDS]({ commit }, cupboardItems) {
      try {
        const pantry = createPantry(cupboardItems)

        await pantryDocRef.update(pantry)

        commit(SET_CUPBOARDS, cupboardItems)
      } catch (err) {
        console.error(err)
      }
    },
    async [GET_CUPBOARDS]({ commit }) {
      try {
        pantryDocRef.onSnapshot((doc) => {
          const data = doc.data() || {}
          if (!isEmpty(data)) {
            commit(SET_CUPBOARDS, data)
          }
        })
      } catch (err) {
        console.error(err)
      }
    },
    async [DELETE_CUPBOARD](context, cupboardItem) {
      try {
        const key = createPantryKey(cupboardItem.ingredient)

        // Store gets updated automatically. No need to mutate
        await pantryDocRef.update({
          [key]: deleteField()
        })
      } catch (err) {
        console.error(err)
      }
    }
  },
  mutations: {
    [SET_CUPBOARDS](state, cupboardItems) {
      if (Array.isArray(cupboardItems)) {
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
