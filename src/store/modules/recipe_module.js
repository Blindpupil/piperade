import Vue from 'vue'
import { snakeCase, isEmpty } from 'lodash-es'
import { usersColRef } from '@/firebase'
import createRecipe from '@/store/models/Recipe'
import { WRITE_RECIPE } from '@/store/types/action_types'
import {
  SET_CATEGORIES,
  SET_INGREDIENTS,
  SET_INGREDIENT_EDIT,
  SET_RECIPE_NAME,
  ADD_RECIPE
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
    recipeName: state => state.recipeName
  },
  actions: {
    async [WRITE_RECIPE](context, recipe = {}) {
      try {
        const data = createRecipe(recipe)

        // TODO: set User module
        const snakeRecipeName = snakeCase(recipe.name)
        const currentUser = 'user1'
        const recipeDocName = `${currentUser}_${snakeRecipeName}`

        await usersColRef.doc(currentUser).collection('recipes').doc(recipeDocName).set(data)
      } catch (err) {
        console.error(err)
      }
    }
  },
  mutations: {
    [ADD_RECIPE](state, recipe) {
      state.recipes.push(recipe)
    },
    [SET_CATEGORIES](state, categories) {
      // eslint-disable-next-line
      state.categories = categories
    },
    [SET_INGREDIENTS](state, { ingredient, index, isNew }) {
      if (isEmpty(ingredient)) {
        state.ingredients.splice(index, 1)
      } else if (isNew) {
        state.ingredients.push(ingredient)
      } else {
        Vue.set(state.ingredients, index, ingredient)
      }
    },
    [SET_INGREDIENT_EDIT](state, ingredient) {
      // eslint-disable-next-line
      state.ingredientEdit = ingredient
    },
    [SET_RECIPE_NAME](state, name) {
      // eslint-disable-next-line
      state.recipeName = name
    }
  }
}
