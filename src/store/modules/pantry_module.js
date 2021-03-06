import { isEmpty } from 'lodash-es'
import { pantryColRef } from '@/firebase'
import {
  createCupboardItem,
  createPantryKey,
  createPantry
} from '@/store/models/Pantry'
import {
  WRITE_CUPBOARDS,
  WRITE_PANTRY,
  GET_CUPBOARDS,
  DELETE_CUPBOARD
} from '@/store/types/action_types'
import {
  SET_CUPBOARDS,
  REMOVE_CUPBOARD
} from '@/store/types/mutation_types'

export default {
  state: {
    cupboards: [],
    unitsList: ['cloves', 'units', 'g', 'kg', 'oz', 'lb', 'ml', 'cl', 'l', 'tsp', 'Tbs', 'cups']
  },
  getters: {},
  actions: {
    async [GET_CUPBOARDS]({ commit, rootState }) {
      const { currentUser } = rootState.user
      try {
        pantryColRef(currentUser).orderBy('added').onSnapshot((docs) => {
          const cupboardItems = []
          docs.forEach(doc => cupboardItems.push(doc.data()))
          if (!isEmpty(cupboardItems)) {
            commit(SET_CUPBOARDS, { cupboardItems })
          }
        })
      } catch (err) {
        console.error(err)
      }
    },
    async [WRITE_PANTRY]({ rootState }, data = {}) {
      const { currentUser } = rootState.user
      try {
        const pantry = createPantry(data)
        const keys = Object.keys(pantry)

        const key = keys[0]
        await pantryColRef(currentUser).doc(key).set(pantry[key])
      } catch (err) {
        console.error(err)
      }
    },
    async [WRITE_CUPBOARDS]({ rootState }, data) {
      const { currentUser } = rootState.user
      const cupboardItems = data.cupboardItems || data
      try {
        const pantry = createPantry(cupboardItems)
        const keys = Object.keys(pantry)

        if (Array.isArray(data)) {
          await keys.forEach((key) => {
            pantryColRef(currentUser).doc(key).set(pantry[key])
          })
        }
      } catch (err) {
        console.error(err)
      }
    },
    async [DELETE_CUPBOARD]({ rootState }, cupboardItem) {
      const { currentUser } = rootState.user
      try {
        const key = createPantryKey(cupboardItem.ingredient)

        // Store gets updated automatically. No need to mutate
        await pantryColRef(currentUser).doc(key).delete()
      } catch (err) {
        console.error(err)
      }
    }
  },
  mutations: {
    [SET_CUPBOARDS](state, { cupboardItems, isNew }) {
      if (isNew) { // add new
        const newCupboard = createCupboardItem(cupboardItems)
        state.cupboards.push(newCupboard)
      } else if (Array.isArray(cupboardItems)) { // set from props
        // eslint-disable-next-line
        state.cupboards = cupboardItems
      } else { // set from GET_CUPBOARDS action
        const cupboardItemsArr = Object.values(cupboardItems)
        // eslint-disable-next-line
        state.cupboards = cupboardItemsArr
      }
    },
    [REMOVE_CUPBOARD](state, { index }) {
      state.cupboards.splice(index, 1)
    }
  }
}
