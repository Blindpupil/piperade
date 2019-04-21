import { isEmpty, keyBy } from 'lodash-es'

export function createIngredient(data = {}) {
  const {
    ingredient,
    quantity,
    unit,
    price = ''
  } = data

  return {
    ingredient: ingredient.toLowerCase(),
    quantity,
    unit,
    price
  }
}

export function createRecipe(data = {}) {
  const {
    added,
    duration,
    ingredients,
    name
  } = data
  const lowerName = name.toLowerCase()

  let ingredientsObj = ingredients || {}

  if (!isEmpty(ingredients) && Array.isArray(ingredients)) {
    const formatedIngredients = ingredients.map(i => createIngredient(i))

    ingredientsObj = keyBy(formatedIngredients, i => i.ingredient.toLowerCase())
  }

  const date = added || new Date()

  const formatedDuration = {
    hours: duration.hours || 0,
    minutes: duration.minutes || ''
  }

  const formatedData = {
    ...data,
    added: date,
    duration: formatedDuration,
    name: lowerName,
    ingredients: ingredientsObj
  }

  if (data.id) Object.assign(formatedData, { id: data.id })

  return Object.freeze(formatedData)
}

export function getIngredientsNamesArray({ ingredients } = {}) {
  return Object.keys(ingredients)
}

export function filterRecipeByPantry({ recipe = {}, cupboards = [] } = {}) {
  const result = []
  const ingredients = Object.values(recipe.ingredients)

  ingredients.forEach((item) => {
    const match = cupboards.find(
      cupboard => (cupboard.ingredient === item.ingredient) && (cupboard.unit === item.unit)
    )

    const missing = match ? Number(item.quantity) - Number(match.quantity) : item.quantity
    const obtained = missing <= 0

    result.push({
      ...item,
      missing,
      obtained
    })
  })

  const ingredientsObtained = result.filter(i => i.obtained).length

  return {
    ...recipe,
    ingredients: result,
    ingredientsObtained
  }
}

// RECIPE DOCUMENT EXAMPLE (and how it's stored in FS)
// const Users = { // Users Collection
//   userId: { // Document
//     recipes: { // Sub-collection
//       recipeId: { // Document
//         added: Date,
//         categories: [
//           {
//             text: String,
//             color: String
//           }
//         ],
//         duration: {
//           hours: Number,
//           minutes: Number
//         },
//         id: String,
//         ingredients: {
//           'ingredient name': {
//             ingredient: 'ingredient name',
//             quantity: Number,
//             unit: String,
//             price: Number
//           }
//         },
//         name: String,
//         instructions: String, // (not indexed)
//         picture: String, // (not indexed)
//         portions: Number, // (not indexed)
//         public: Boolean
//       }
//     }
//   }
// }
