import Vue from 'vue'
import { isEmpty } from 'lodash-es'
import { recipesColRef } from '@/firebase'
import {
  createRecipe,
  filterRecipeByPantry,
  getIngredientsNamesArray
} from '@/store/models/Recipe'
import {
  GET_RECIPES,
  WRITE_RECIPE,
  DELETE_RECIPE,
  WRITE_INGREDIENTS
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
    recipeCategories: state => state.recipe.categories,
    recipeIngredients: (state) => {
      const ingredientsObj = state.recipe.ingredients
      let ingredientsArray = []

      if (!isEmpty(ingredientsObj)) {
        ingredientsArray = Object.values(ingredientsObj)
      }
      return ingredientsArray
    },
    recipesFilteredByPantry: (state, getters, rootState) => {
      const { cupboards } = rootState.pantry
      const filteredRecipes = []

      state.recipes.forEach((recipe) => {
        const filtered = filterRecipeByPantry({ recipe, cupboards })
        filteredRecipes.push(filtered)
      })
      return filteredRecipes
    }
  },
  actions: {
    async [GET_RECIPES]({ commit, rootState }) {
      const { currentUser } = rootState.user
      commit(SET_LOADING, true)
      try {
        await recipesColRef(currentUser).orderBy('added').onSnapshot((querySnapshot) => {
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
    async [WRITE_RECIPE]({ commit, dispatch, rootState }, recipe = {}) {
      const { currentUser } = rootState.user
      commit(SET_LOADING, true)
      try {
        const data = createRecipe(recipe)
        const { id } = recipe

        if (id) {
          await recipesColRef(currentUser).doc(id).update(data)
        } else {
          await recipesColRef(currentUser).add(data)
        }

        const ingredientsList = getIngredientsNamesArray(recipe)

        dispatch(WRITE_INGREDIENTS, { ingredientsList })

        commit(SET_RECIPE, data)
        commit(SET_LOADING, false)
      } catch (err) {
        console.error(err)
      }
    },
    async [DELETE_RECIPE]({ commit, rootState }, { id }) {
      const { currentUser } = rootState.user
      try {
        if (id) {
          await recipesColRef(currentUser).doc(id).delete()

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
