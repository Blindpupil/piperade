import * as firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/firestore'
import config from '@/firebase/config'

// Shtaart
firebase.initializeApp(config)

const firestore = firebase.firestore()
const settings = { timestampsInSnapshots: true }
firestore.settings(settings)

// Auth function
export const auth = firebase.auth()

// Firestore
const db = firebase.firestore()
export const usersColRef = db.collection('users') // reference of Users collection
