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
// Server time value
export const timestamp = firebase.firestore.FieldValue.serverTimestamp()

// Auth
export const auth = firebase.auth()
export const googleProvider = new firebase.auth.GoogleAuthProvider()

/*
  REFERENCES
*/
// reference of Users collection
export const usersColRef = db.collection('users')
// reference of Recipes collection
export const recipesColRef = currentUser => usersColRef.doc(currentUser).collection('recipes')
// reference of Pantry document
export const pantryColRef = currentUser => usersColRef.doc(currentUser).collection('pantry')
// reference for Lists collection
export const listsColRef = currentUser => usersColRef.doc(currentUser).collection('lists')
