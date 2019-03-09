import Vue from 'vue'
import { isEmpty } from 'lodash-es'
import { recipesColRef } from '@/firebase'
import { createRecipe } from '@/store/models/Recipe'
import {
  GET_RECIPES,
  WRITE_RECIPE,
  DELETE_RECIPE
} from '@/store/types/action_types'
import {
  SET_LOADING,
  SET_RECIPE,
  SET_RECIPES,
  RESET_RECIPE
} from '@/store/types/mutation_types'

export default {
  state: {
    recipe: {},
    recipes: []
  },
  getters: {
    recipe: state => state.recipe,
    recipes: state => state.recipes,
    recipeCategories: state => state.recipe.categories,
    recipeIngredients: (state) => {
      const ingredientsObj = state.recipe.ingredients
      const ingredientsArray = []
      if (!isEmpty(ingredientsObj)) {
        Object.keys(ingredientsObj)
          .forEach(key => ingredientsArray.push(ingredientsObj[key]))
      }
      return ingredientsArray
    }
  },
  actions: {
    async [GET_RECIPES]({ commit }) {
      commit(SET_LOADING, true)
      try {
        await recipesColRef.orderBy('added').onSnapshot((querySnapshot) => {
          const recipes = []
          querySnapshot.forEach((doc) => {
            if (doc.exists) {
              const { id } = doc
              const data = doc.data()
              recipes.push({ ...data, id })
            }
          })
          commit(SET_RECIPES, recipes)
          commit(SET_LOADING, false)
        })
      } catch (err) {
        console.error(err)
      }
    },
    async [WRITE_RECIPE]({ commit }, recipe = {}) {
      commit(SET_LOADING, true)
      try {
        const data = createRecipe(recipe)
        const { id } = recipe

        if (id) {
          await recipesColRef.doc(id).update(data)
        } else {
          await recipesColRef.add(data)
        }

        commit(SET_RECIPE, data)
        commit(SET_LOADING, false)
      } catch (err) {
        console.error(err)
      }
    },
    async [DELETE_RECIPE]({ commit }, { id }) {
      try {
        if (id) {
          await recipesColRef.doc(id).delete()

          commit(RESET_RECIPE)
        }
      } catch (err) {
        console.error(err)
      }
    }
  },
  mutations: {
    [SET_RECIPE](state, recipe) {
      if (recipe.id) {
        const { recipes } = state
        const targetIndex = recipes.findIndex(target => target.id === recipe.id)

        Vue.set(recipes, targetIndex, recipe)
      }
      // eslint-disable-next-line no-param-reassign
      state.recipe = recipe
    },
    [SET_RECIPES](state, recipes) {
      // eslint-disable-next-line
      state.recipes = recipes
    },
    [RESET_RECIPE](state) {
      // eslint-disable-next-line
      state.recipe = {}
    }
  }
}
