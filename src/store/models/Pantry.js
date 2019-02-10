import {
  isEmpty,
  keyBy
} from 'lodash-es'

export function createPantryKey(data) {
  let key

  if (typeof data === 'string') {
    key = data.toLowerCase()
  } else {
    key = data.ingredient.toLowerCase()
  }

  return key
}

const formattedPantry = data => Object.assign({}, {
  ingredient: data.ingredient,
  unit: data.unit ? data.unit : 'units',
  quantity: data.quantity ? data.quantity : '',
  price: data.price ? data.price : ''
})

export function createPantry(data = []) {
  if (isEmpty(data)) return {}

  let formattedData

  if (Array.isArray(data)) {
    const pantryArray = data.forEach(i => formattedPantry(i))

    formattedData = keyBy(pantryArray, i => createPantryKey(i.ingredient))
  } else {
    const key = createPantryKey(data.ingredient)
    const pantryObj = formattedPantry(data)

    formattedData = {
      [key]: pantryObj
    }
  }

  return Object.freeze(formattedData)
}

// PANTRY DOCUMENT EXAMPLE (and how it's stored in FS)
// const Users = {  // Users Collection
//   userId: {  // Document
//     eadables: {  // sub-collection
//       ingredients: { ... },
//       pantry: {  // map
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
