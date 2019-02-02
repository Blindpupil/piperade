import {
  isEmpty,
  snakeCase,
  keyBy
} from 'lodash-es'

export default function createPantry(data = []) {
  if (isEmpty(data)) return {}

  const formatedData = keyBy(data, i => snakeCase(i.ingredient).toLowerCase())

  return Object.freeze(formatedData)
}

// PANTRY DOCUMENT EXAMPLE (and how it's stored in FS)
// const Users = { // Users Collection
//   userId: { // Document
//     eadables: { // sub-collection
//       ingredients: {
//         // ...
//       },
//       pantry: { // map
//         ingredient_name: {
//           ingredient: 'ingredient name',
//           unit: String,
//           quantity: Number,
//           price: Number
//         }
//       }
//     }
//   }
// }
