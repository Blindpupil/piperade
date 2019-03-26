import {
  isEmpty,
  keyBy
} from 'lodash-es'

export function createPantryKey(data) {
  let key

  if (typeof data === 'string') {
    key = data.toLowerCase()
  } else if (data.ingredient) {
    key = data.ingredient.toLowerCase()
  }

  return key
}

export function createCupboardItem(data = {}) {
  const {
    ingredient,
    quantity = '',
    unit = '',
    price = '',
    added = null
  } = data

  return {
    ingredient: ingredient.toLowerCase(),
    quantity,
    unit,
    price,
    added
  }
}

export function createPantry(data) {
  if (isEmpty(data)) return {}

  let formattedData
  const added = new Date()

  if (Array.isArray(data)) {
    const pantryArray = data.forEach(i => createCupboardItem(i))

    pantryArray.forEach((i) => {
      if (isEmpty(i.added)) {
        Object.assign(i, { added })
      }
    })

    formattedData = keyBy(pantryArray, i => createPantryKey(i.ingredient))
  } else {
    const key = createPantryKey(data.ingredient)
    const pantryObj = createCupboardItem(data)

    if (isEmpty(pantryObj.added)) {
      Object.assign(pantryObj, { added })
    }

    formattedData = {
      [key]: pantryObj
    }
  }

  return Object.freeze(formattedData)
}

// PANTRY DOCUMENT EXAMPLE (and how it's stored in FS)
// const Users = {  // Users Collection
//   userId: {  // Document
//     pantry: {  // Collection
//       ingredient name: {
//         ingredient: 'ingredient name',
//         unit: String,
//         quantity: Number,
//         price: Number,
//         added: Date
//       }
//     }
//   }
// }
