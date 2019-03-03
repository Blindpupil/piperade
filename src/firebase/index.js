import * as firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/firestore'
import config from '@/firebase/config'

// Shtaart
firebase.initializeApp(config)

// Firestore
const db = firebase.firestore()

const settings = { timestampsInSnapshots: true }
db.settings(settings)

// Delete field function
export const deleteField = () => firebase.firestore.FieldValue.delete()

// Auth
export const auth = firebase.auth()
const currentUser = 'user1' // (TODO)


/*
  REFERENCES
*/
// reference of Users collection
export const usersColRef = db.collection('users')
// reference of Recipes collection
export const recipesColRef = usersColRef.doc(currentUser).collection('recipes')
// reference of Pantry document
export const pantryColRef = usersColRef.doc(currentUser).collection('pantry')
