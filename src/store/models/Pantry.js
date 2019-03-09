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
    quantity,
    unit,
    price = ''
  } = data

  return {
    ingredient,
    quantity,
    unit,
    price
  }
}

const formattedPantry = data => Object.assign({}, {
  ingredient: data.ingredient,
  unit: data.unit ? data.unit : '',
  quantity: data.quantity ? data.quantity : '',
  price: data.price ? data.price : '',
  added: data.added ? data.added : null
})

export function createPantry(data) {
  if (isEmpty(data)) return {}

  let formattedData
  const added = new Date()

  if (Array.isArray(data)) {
    const pantryArray = data.forEach(i => formattedPantry(i))

    pantryArray.forEach((i) => {
      if (isEmpty(i.added)) {
        Object.assign(i, { added })
      }
    })

    formattedData = keyBy(pantryArray, i => createPantryKey(i.ingredient))
  } else {
    const key = createPantryKey(data.ingredient)
    const pantryObj = formattedPantry(data)

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
