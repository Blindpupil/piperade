import Vue from 'vue'
import { isEmpty } from 'lodash-es'
import { listsColRef } from '@/firebase'
import {
  createList,
  createFullList,
  parseListRecipes,
  calculateIngredientsByPortion
} from '@/store/models/List'
import {
  GET_LISTS,
  WRITE_LIST,
  DELETE_LIST,
  PARSE_LIST_ITEMS,
  PARSE_LIST_PORTIONS
} from '@/store/types/action_types'
import {
  SET_LIST,
  SET_LISTS,
  SET_LOADING,
  RESET_LIST,
  ADDED_CUPBOARD_FROM_LIST,
  REMOVED_CUPBOARD_FROM_LIST,
  ADD_EXRA_LIST_ITEM,
  REMOVE_EXTRA_LIST_ITEM
} from '@/store/types/mutation_types'

export default {
  state: {
    list: {},
    lists: []
  },
  getters: {
    fullLists: (state, getters, rootState) => {
      const { lists } = state
      const { recipesFilteredByPantry } = getters
      const { cupboards } = rootState.pantry

      const fullLists = lists.map((list) => {
        const parsedListRecipes = parseListRecipes({ list, recipes: recipesFilteredByPantry })

        const parsedList = {
          ...list,
          recipes: parsedListRecipes
        }

        const fullList = createFullList({ list: parsedList, cupboards })

        return fullList
      })

      return fullLists
    }
  },
  actions: {
    async [GET_LISTS]({ commit, rootState }) {
      const { currentUser } = rootState.user
      const { recipes } = rootState.recipe

      commit(SET_LOADING, true)
      try {
        await listsColRef(currentUser).orderBy('edited', 'desc').onSnapshot((docs) => {
          const lists = []
          docs.forEach((doc) => {
            if (doc.exists) {
              const { id } = doc
              const data = doc.data()
              lists.push({ ...data, id })
            }
          })

          // Populate lists recipes IDs with recipe objects
          console.log({ recipes })

          if (!isEmpty(lists)) {
            commit(SET_LISTS, lists)
          }
        })

        commit(SET_LOADING, false)
      } catch (err) {
        console.error(err)
      }
    },
    async [WRITE_LIST]({ rootState }, data = {}) {
      const { currentUser } = rootState.user
      try {
        let list
        if (typeof data.recipes[0] === 'string') {
          // list is already formatted
          list = data
        } else if (isEmpty(data.recipes) || !data.cupboards) {
          list = createList({ list: data })
        } else {
          list = createList(data)
        }

        const { id } = data

        if (id) {
          await listsColRef(currentUser).doc(id).update(list)
        } else {
          await listsColRef(currentUser).add(list)
        }
      } catch (err) {
        console.error(err)
      }
    },
    async [DELETE_LIST]({ commit, rootState }, list) {
      const { currentUser } = rootState.user
      try {
        const { id } = list

        await listsColRef(currentUser).doc(id).delete()
        commit(SET_LIST, {})
      } catch (err) {
        console.error(err)
      }
    },
    [PARSE_LIST_ITEMS]({ commit, getters, rootState }, list) {
      const { cupboards } = rootState.pantry

      const parsedList = createList({ list, cupboards })

      if (isEmpty(list.recipes)) {
        commit(SET_LIST, {
          ...parsedList,
          recipes: [],
          items: []
        })
        return
      }

      const { recipesFilteredByPantry } = getters
      const parsedListRecipes = parseListRecipes({ list, recipes: recipesFilteredByPantry })

      const parsedListWithRecipes = {
        ...parsedList,
        recipes: parsedListRecipes
      }

      commit(SET_LIST, parsedListWithRecipes)
    },
    [PARSE_LIST_PORTIONS]({ commit, rootState }, { list, recipe, listPortions } = {}) {
      const parsedRecipe = calculateIngredientsByPortion({ recipe, listPortions })
      const recipeIndex = list.recipes.findIndex(item => item.id === parsedRecipe.id)
      const recipes = [...list.recipes]
      recipes[recipeIndex] = parsedRecipe

      const newList = {
        ...list,
        recipes
      }

      const { cupboards } = rootState.pantry
      const parsedList = createFullList({ list: newList, cupboards })

      commit(SET_LIST, parsedList)

      // const { id } = parsedList
      // const listIndex = rootState.list.lists.findIndex(i => i.id === id)
      // const lists = [...rootState.list.lists]
      // lists[listIndex] = parsedList
    }
  },
  mutations: {
    [SET_LISTS](state, lists) {
      // eslint-disable-next-line
      state.lists = lists
    },
    [SET_LIST](state, list) {
      // eslint-disable-next-line
      state.list = list
    },
    [ADD_EXRA_LIST_ITEM](state, { item, index }) {
      if (!state.list.extras) {
        // eslint-disable-next-line
        state.list.extras = [item]
      } else {
        // eslint-disable-next-line
        state.list.extras[index] = item
      }
    },
    [ADDED_CUPBOARD_FROM_LIST](state, cupboard) {
      const { items } = state.list
      const index = items.findIndex(item => item.ingredient === cupboard.ingredient)
      const missing = 0

      const newItem = {
        ...items[index],
        obtained: true,
        missing
      }

      Vue.set(state.list.items, index, newItem)
    },
    [REMOVED_CUPBOARD_FROM_LIST](state, cupboard) {
      const { items } = state.list
      const index = items.findIndex(item => item.ingredient === cupboard.ingredient)
      const { quantity } = items[index]

      const newItem = {
        ...items[index],
        obtained: false,
        missing: quantity
      }

      Vue.set(state.list.items, index, newItem)
    },
    [REMOVE_EXTRA_LIST_ITEM](state, { index }) {
      state.list.extras.splice(index, 1)
    },
    [RESET_LIST](state) {
      // eslint-disable-next-line
      state.list = {}
    }
  }
}
