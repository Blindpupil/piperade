import { isEmpty } from 'lodash-es'
import { pantryColRef } from '@/firebase'
import {
  createCupboardItem,
  createPantryKey,
  createPantry
} from '@/store/models/Pantry'
import {
  WRITE_CUPBOARDS,
  GET_CUPBOARDS,
  DELETE_CUPBOARD
} from '@/store/types/action_types'
import { SET_CUPBOARDS } from '@/store/types/mutation_types'

export default {
  state: {
    cupboards: [],
    unitsList: ['cloves', 'units', 'cl', 'g', 'k', 'l', 'ts', 'tbs', 'ml', 'oz', 'cups'],
    ingredientsList: ['garlic', 'onion', 'tomato', 'red bell pepper', 'egg']
  },
  getters: {
    cupboards: state => state.cupboards,
    unitsList: state => state.unitsList,
    ingredientsList: state => state.ingredientsList
  },
  actions: {
    async [GET_CUPBOARDS]({ commit }) {
      try {
        pantryColRef.orderBy('added').onSnapshot((docs) => {
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
    async [WRITE_CUPBOARDS](context, data) {
      const cupboardItems = data.cupboardItems || data
      try {
        const pantry = createPantry(cupboardItems)
        const keys = Object.keys(pantry)

        if (Array.isArray(data)) {
          await keys.forEach((key) => {
            pantryColRef.doc(key).set(pantry[key])
          })
        } else {
          const key = keys[0]
          await pantryColRef.doc(key).set(pantry[key])
        }
      } catch (err) {
        console.error(err)
      }
    },
    async [DELETE_CUPBOARD](context, cupboardItem) {
      try {
        const key = createPantryKey(cupboardItem.ingredient)

        // Store gets updated automatically. No need to mutate
        await pantryColRef.doc(key).delete()
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
        state.cupboards = [...cupboardItems]
      } else { // set from GET_CUPBOARDS action
        const cupboardItemsArr = Object.values(cupboardItems)
        // eslint-disable-next-line
        state.cupboards = [...cupboardItemsArr]
      }
    }
  }
}
