import { snakeCase, keyBy } from 'lodash-es'

export default function createRecipe(data = {}) {
  const { categories, ingredients } = data
  const ingredientsObj = keyBy(ingredients, i => snakeCase(i.ingredient).toLowerCase())
  const categoriesObj = keyBy(categories, cat => snakeCase(cat.text).toLowerCase())

  const formatedData = {
    ...data,
    categories: categoriesObj,
    ingredients: ingredientsObj
  }

  return Object.freeze(formatedData)
}

// RECIPE DOCUMENT EXAMPLE (and how it's stored in FS)
// const Users = { // Users Collection
//   userId: { // Document
//     recipes: { // Sub-collection
//       userId_recipe_name: { // Document
//         name: String,
//         ingredients: {
//           ingredient_name: {
//             ingredient: 'ingredient name',
//             quantity: Number,
//             unit: String,
//             price: Number,
//             substitutes: String
//           }
//         },
//         portions: Number, // (not indexed)
//         instructions: String, // (not indexed)
//         categories: {
//           category_name: {
//             text: String,
//             color: String
//           }
//         },
//         picture: String, // (not indexed)
//         public: Boolean
//       }
//     }
//   }
// }
