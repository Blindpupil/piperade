import { keyBy } from 'lodash-es'

export function createRecipe(data = {}) {
  const { ingredients, name } = data
  const lowerName = name.toLowerCase()
  const ingredientsObj = keyBy(ingredients, i => i.ingredient.toLowerCase())

  const formatedData = {
    ...data,
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
    substitute,
    price = ''
  } = data

  return {
    ingredient,
    quantity,
    unit,
    substitute,
    price
  }
}

// RECIPE DOCUMENT EXAMPLE (and how it's stored in FS)
// const Users = { // Users Collection
//   userId: { // Document
//     recipes: { // Sub-collection
//       recipeId: { // Document
//         name: String,
//         ingredients: {
//           ingredient name: {
//             ingredient: 'ingredient name',
//             quantity: Number,
//             unit: String,
//             price: Number,
//             substitute: String
//           }
//         },
//         portions: Number, // (not indexed)
//         instructions: String, // (not indexed)
//         categories: [
//           {
//             text: String,
//             color: String
//           }
//         ],
//         picture: String, // (not indexed)
//         public: Boolean
//       }
//     }
//   }
// }
