import { isEmpty } from 'lodash-es'
import { listsColRef } from '@/firebase'
import {
  createList,
  createListItemFromRecipe
} from '@/store/models/List'
import {
  GET_LISTS,
  WRITE_LIST,
  DELETE_LIST
} from '@/store/types/action_types'
import { SET_LIST, SET_LISTS } from '@/store/types/mutation_types'

export default {
  state: {
    lists: [],
    list: {}
  },
  getters: {
    lists: state => state.lists,
    list: state => state.list,
    listItems: state => state.list.items
  },
  actions: {
    async [GET_LISTS]({ commit }) {
      try {
        listsColRef.orderBy('added', 'desc').onSnapshot((docs) => {
          const lists = []
          docs.forEach(doc => lists.push(doc.data()))
          if (!isEmpty(lists)) {
            commit(SET_LISTS, lists)
          }
        })
      } catch (err) {
        console.error(err)
      }
    },
    async [WRITE_LIST](context, data = {}) {
      try {
        const { recipes } = data
        const listItems = recipes.map(recipe => createListItemFromRecipe(recipe))
        console.log('listItems', listItems)
        const formattedData = {
          ...data,
          recipes: listItems
        }
        const list = createList(formattedData)
        const { id } = data

        console.log('list', list)

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
        const { key } = list

        // Store gets updated automatically. No need to mutate
        await listsColRef.doc(key).delete()
      } catch (err) {
        console.error(err)
      }
    }
  },
  mutations: {
    [SET_LISTS](state, lists) {
      // eslint-disable-next-line
      state.lists = lists
    },
    [SET_LIST](state, list) {
      // eslint-disable-next-line
      state.lists = list
    }
  }
}
