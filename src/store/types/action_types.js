/**
 * AUTH
 */
export const SESSION = 'session'
export const GOOGLE_AUTH = 'authenticate with google'
export const HANDLE_PROVIDER_RESPONSE = 'handle auth response from provider'
export const LOGOUT = 'logout'
export const SAVE_USER = 'save user to firebase'

/**
 * RECIPES COLLECTION
 */
export const GET_RECIPES = 'get user recipes'
export const WRITE_RECIPE = 'write recipe doc'
export const DELETE_RECIPE = 'delete recipe'

/**
 * PANTRY COLLECTION
 */
export const WRITE_CUPBOARDS = 'write user cupboard items'
export const GET_CUPBOARDS = 'get user cupboard items'
export const DELETE_CUPBOARD = 'delete an ingredient from Pantry'
export const GET_USER_INGREDIENTS = 'get user ingredients'

/**
 * LISTS COLLECTION
 */
export const GET_LISTS = 'get lists'
export const WRITE_LIST = 'write list'
export const DELETE_LIST = 'delete list'
export const PARSE_LIST_ITEMS = 'parse list items from recipes and cupboards'
export const GET_LIST_RECIPES = 'get complete recipe objects for list'
