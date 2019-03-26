import { isEmpty, uniq } from 'lodash-es'
import Vue from 'vue'
import { currentUserDoc } from '@/firebase'
import {
  GET_INGREDIENTS,
  WRITE_INGREDIENTS
} from '@/store/types/action_types'
import {
  SET_USER_INGREDIENTS,
  SET_USER_INGREDIENT,
  REMOVE_USER_INGREDIENT
} from '@/store/types/mutation_types'

export default {
  state: {
    ingredientsList: []
  },
  getters: {},
  actions: {
    async [GET_INGREDIENTS]({ commit, rootState }) {
      const { currentUser } = rootState.user
      try {
        currentUserDoc(currentUser).onSnapshot((doc) => {
          const { ingredientsList } = doc.data()
          if (!isEmpty(ingredientsList)) {
            commit(SET_USER_INGREDIENTS, { ingredientsList })
          }
        })
      } catch (err) {
        console.error(err)
      }
    },
    async [WRITE_INGREDIENTS]({ rootState, state }, { ingredientsList = [] }) {
      const { currentUser } = rootState.user
      try {
        const newList = uniq([...state.ingredientsList, ...ingredientsList])

        await currentUserDoc(currentUser).update({
          ingredientsList: newList
        })
      } catch (err) {
        console.error(err)
      }
    }
  },
  mutations: {
    [SET_USER_INGREDIENTS](state, { ingredientsList }) {
      // eslint-disable-next-line
      state.ingredientsList = ingredientsList
    },
    [SET_USER_INGREDIENT](state, { ingredient, index }) {
      Vue.set(state.ingredientsList, index, ingredient)
    },
    [REMOVE_USER_INGREDIENT](state, index) {
      Vue.delete(state.ingredientsList, index)
    }
  }
}
