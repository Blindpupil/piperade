import { keyBy } from 'lodash-es'

export function createRecipe(data = {}) {
  const {
    added,
    duration,
    ingredients,
    name
  } = data
  const lowerName = name.toLowerCase()
  const ingredientsObj = ingredients
    ? keyBy(ingredients, i => i.ingredient.toLowerCase())
    : {}

  const date = added || new Date()

  const formatDuration = {
    hours: duration.hours || 0,
    minutes: duration.minutes || ''
  }

  const formatedData = {
    ...data,
    added: date,
    duration: formatDuration,
    name: lowerName,
    ingredients: ingredientsObj
  }

  return Object.freeze(formatedData)
}

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
