import Vue from 'vue'
import { isEmpty } from 'lodash-es'
import { recipesColRef } from '@/firebase'
import { createIngredient, createRecipe } from '@/store/models/Recipe'
import {
  GET_RECIPES,
  WRITE_RECIPE,
  DELETE_RECIPE
} from '@/store/types/action_types'
import {
  SET_LOADING,
  SET_CATEGORIES,
  SET_INGREDIENTS,
  SET_INGREDIENT_EDIT,
  SET_RECIPE_NAME,
  SET_RECIPES,
  RESET_RECIPE
} from '@/store/types/mutation_types'

export default {
  state: {
    categories: [],
    ingredientEdit: {},
    ingredients: [],
    recipeName: '',
    recipes: []
  },
  getters: {
    categories: state => state.categories,
    ingredientEdit: state => state.ingredientEdit,
    ingredients: state => state.ingredients,
    recipeName: state => state.recipeName,
    recipes: state => state.recipes
  },
  actions: {
    async [GET_RECIPES]({ commit }) {
      commit(SET_LOADING, true)
      try {
        await recipesColRef.onSnapshot((querySnapshot) => {
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
    async [WRITE_RECIPE](context, recipe = {}) {
      try {
        const data = createRecipe(recipe)
        const { id } = recipe

        if (id) {
          await recipesColRef.doc(id).update(data)
        } else {
          await recipesColRef.add(data)
        }
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
    [SET_RECIPES](state, recipes) {
      // eslint-disable-next-line
      state.recipes = recipes
    },
    [SET_CATEGORIES](state, categories) {
      // eslint-disable-next-line
      state.categories = categories
    },
    [SET_INGREDIENTS](state, { ingredient, index, isNew }) {
      if (isEmpty(ingredient)) { // delete request
        state.ingredients.splice(index, 1)
      } else if (isNew) { // add new
        const newIngredient = createIngredient(ingredient)
        state.ingredients.push(newIngredient)
      } else if (!isEmpty(index)) { // edit existing
        const editedIngredient = createIngredient(ingredient)
        Vue.set(state.ingredients, index, editedIngredient)
      } else { // set ingredients from props
        const ingredients = []
        Object.keys(ingredient).forEach(i => ingredients.push(ingredient[i]))
        // eslint-disable-next-line
        state.ingredients = ingredients
      }
    },
    [SET_INGREDIENT_EDIT](state, ingredient) {
      // eslint-disable-next-line
      state.ingredientEdit = ingredient
    },
    [SET_RECIPE_NAME](state, name) {
      // eslint-disable-next-line
      state.recipeName = name
    },
    [RESET_RECIPE](state) {
      // eslint-disable-next-line
      state.categories = []
      // eslint-disable-next-line
      state.ingredients = []
    }
  }
}
