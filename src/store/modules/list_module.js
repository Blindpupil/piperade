import Vue from 'vue'
import { isEmpty } from 'lodash-es'
import { listsColRef } from '@/firebase'
import { createList } from '@/store/models/List'
import {
  GET_LISTS,
  WRITE_LIST,
  DELETE_LIST,
  PARSE_LIST_ITEMS
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
    list: state => state.list,
    lists: state => state.lists
  },
  actions: {
    async [GET_LISTS]({ commit }) {
      commit(SET_LOADING, true)
      try {
        await listsColRef.orderBy('edited', 'desc').onSnapshot((docs) => {
          const lists = []
          docs.forEach((doc) => {
            if (doc.exists) {
              const { id } = doc
              const data = doc.data()
              lists.push({ ...data, id })
            }
          })

          if (!isEmpty(lists)) {
            commit(SET_LISTS, lists)
          }
        })

        commit(SET_LOADING, false)
      } catch (err) {
        console.error(err)
      }
    },
    async [WRITE_LIST](context, data = {}) {
      try {
        let list
        if (isEmpty(data.recipes || !data.cupboards)) {
          list = createList({ list: data })
        } else if (typeof data.recipes[0] === 'string') {
          // list is already formatted
          list = data
        } else {
          list = createList(data)
        }

        const { id } = data

        if (id) {
          await listsColRef.doc(id).update(list)
        } else {
          await listsColRef.add(list)
        }
      } catch (err) {
        console.error(err)
      }
    },
    async [DELETE_LIST](context, list) {
      try {
        const { id } = list

        // Store gets updated automatically. No need to mutate
        await listsColRef.doc(id).delete()
      } catch (err) {
        console.error(err)
      }
    },
    [PARSE_LIST_ITEMS]({ commit, rootState }, list) {
      const { cupboards } = rootState.pantry
      const parsedList = createList({ list, cupboards })

      commit(SET_LIST, parsedList)
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
