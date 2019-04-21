import {
  flatten,
  isEmpty,
  trim
} from 'lodash-es'

const sumIngredientQuantities = (ingredients = []) => {
  const sum = []

  ingredients.forEach((current) => {
    const currentIngredient = trim(current.ingredient)

    const matchIndex = sum.findIndex(
      o => (o.ingredient === currentIngredient) && (o.unit === trim(current.unit))
    )

    if (matchIndex === -1) {
      sum.push(current)
    } else {
      const matchObj = sum.splice(matchIndex, 1)[0]
      const quantity = Number(matchObj.quantity) + Number(current.quantity)

      sum.push({
        ...current,
        quantity
      })
    }
  })

  return sum
}

const filterByIngredientsInCupboards = ({ ingredients = [], cupboards = [] } = {}) => {
  const result = []

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

  return result
}

export function createItemsFromRecipes({ recipes = [], cupboards = [] } = {}) {
  const allIngredients = []

  recipes.forEach(recipe => allIngredients.push(Object.values(recipe.ingredients)))

  const ingredients = sumIngredientQuantities(flatten(allIngredients))

  const parsedIngredients = filterByIngredientsInCupboards({ ingredients, cupboards })

  return parsedIngredients
}

export function calculateIngredientsByPortion({ recipe = {}, listPortions } = {}) {
  const { ingredients, portions } = recipe
  const ingredientsArray = Object.values(ingredients)

  const newIngredientsArray = ingredientsArray.map((ingredient) => {
    const { quantity } = ingredient
    const newQuantity = (Number(quantity) * Number(listPortions)) / Number(portions)

    return {
      ...ingredient,
      quantity: newQuantity
    }
  })

  return {
    ...recipe,
    ingredients: newIngredientsArray,
    portions: listPortions,
    listPortions
  }
}

export function parseListRecipes({ list = {}, recipes = [] } = {}) {
  const listRecipes = []

  if (isEmpty(list.recipes)) return []

  list.recipes.forEach((recipe) => {
    const { id, listPortions } = recipe
    // find in the Recipes collection the ones with the ids saved in the list
    const match = recipes.find(r => r.id === id)
    // copy the listPortions from the list to the recipe found
    match.listPortions = listPortions
    listRecipes.push(match)
  })

  return listRecipes.map((recipe) => {
    let result = recipe
    if (!recipe.listPortions) return result // recipe doesn't need recalculation

    if (recipe.portions !== recipe.listPortions) {
      result = calculateIngredientsByPortion({ recipe, listPortions: recipe.listPortions })
    }

    return result
  })
}

// TODO: better naming: `createFullList` returns a Store ready object
export function createFullList({ list = {}, cupboards = [] } = {}) {
  const { recipes } = list
  let { items } = list

  const createdList = {}

  if (!isEmpty(recipes)) {
    items = createItemsFromRecipes({ recipes, cupboards })
    Object.assign(createdList, { items })
  }

  return {
    ...list,
    ...createdList
  }
}

// TODO: better naming: `createList` returns a FB ready object
export function createList({ list = {}, cupboards = [] } = {}) {
  const { recipes } = list
  let { items } = list

  const edited = new Date().toDateString()
  const createdList = {}

  if (!isEmpty(recipes)) {
    items = createItemsFromRecipes({ recipes, cupboards })
    Object.assign(createdList, { items })

    const fbRecipes = recipes.map(recipe => ({ id: recipe.id, listPortions: recipe.portions }))
    Object.assign(createdList, { recipes: fbRecipes })
  }

  return {
    ...list,
    ...createdList,
    edited
  }
}


// LIST DOCUMENT EXAMPLE (and how it's stored in FS)
// const Users = { // Users Collection
//   userId: { // Document
//     lists: [ // Collection
//       {
//         edited: Date,
//         name: 'list name',
//         recipes: [{
//           id: 'recipeIdString',
//           listPortions: Number
//         }],
//         items: [
//           {
//             ingredient: 'name',
//             quantity: Number,
//             unit: String,
//             price: Number,
//             missing: Number,
//             obtained: Boolean
//           }
//         ],
//         extras: [
//           {
//             item: Name,
//             quantity: Number,
//             obtained: Boolean
//           }
//         ]
//       }
//     ]
//   }
// }
