export function createListItemFromRecipe(data = {}) {
  const {
    name,
    ingredients,
    id
  } = data

  let list
  if (Array.isArray(ingredients)) {
    list = ingredients
  } else {
    list = Object.values(ingredients)
  }

  const formattedData = {
    origin: name,
    id,
    list
  }

  return Object.freeze(formattedData)
}

export function createList(data = {}) {
  const {
    added
  } = data

  const date = added || new Date()

  const formattedData = {
    ...data,
    added: date
  }

  return Object.freeze(formattedData)
}

// LIST DOCUMENT EXAMPLE (and how it's stored in FS)
// const Users = {  // Users Collection
//   userId: {  // Document
//     lists: [  // Collection
//       {
//         added: Date,
//         name: 'list name',
//         items: [
//           {
//             origin: 'recipe name',
//             id: 'recipeIdString',
//             list: [{ ingredientObjs }]
//           },
//           {
//             origin: 'other name',
//             id: 'otherRecipeIdString',
//             list: [{ ingredientObjs }]
//           },
//           {
//             origin: 'user items',
//             id: null,
//             list: [{ userCustomItems }]
//           }
//         ]
//       }
//     ]
//   }
// }
