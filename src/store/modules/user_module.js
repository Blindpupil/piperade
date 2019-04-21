import { get, isEmpty } from 'lodash-es'
import {
  auth,
  usersColRef,
  currentUserDoc,
  googleProvider
} from '@/firebase'
import createUser from '@/store/models/User'
import {
  SESSION,
  LOGOUT,
  GOOGLE_AUTH,
  HANDLE_PROVIDER_RESPONSE,
  SAVE_USER,
  GET_USER_DETAILS
} from '@/store/types/action_types'
import {
  SET_USER,
  SET_USER_DETAILS,
  SET_ERROR,
  SET_LOGOUT
} from '@/store/types/mutation_types'

const userInSession = () => new Promise((resolve, reject) => {
  auth.onAuthStateChanged((user) => {
    if (user) {
      resolve(user.uid)
    } else {
      reject(Error('No user authenticated'))
    }
  })
})

export default {
  state: {
    currentUser: null,
    userDetails: {}
  },
  getters: {},
  actions: {
    async [SESSION]({ state, commit }) {
      const { currentUser } = state
      if (!isEmpty(currentUser)) return

      let user
      try {
        user = await userInSession()
        commit(SET_USER, user)
      } catch (err) {
        commit(SET_ERROR, err)
        console.error('error in session.', err)
      }
    },
    async [GET_USER_DETAILS]({ state, commit }) {
      const { currentUser } = state
      if (isEmpty(currentUser)) return

      try {
        currentUserDoc(currentUser).onSnapshot((doc) => {
          const userDetails = doc.data()
          if (!isEmpty(userDetails)) {
            commit(SET_USER_DETAILS, userDetails)
          }
        })
      } catch (err) {
        console.error('error in get user details', err)
      }
    },
    async [GOOGLE_AUTH]({ commit }) {
      try {
        await auth.signInWithRedirect(googleProvider)
      } catch (err) {
        console.error('error in GOOGLE_AUTH', err)
        commit(SET_ERROR, err)
      }
    },
    async [HANDLE_PROVIDER_RESPONSE]({ commit, dispatch }) {
      try {
        const result = await auth.getRedirectResult()
        if (isEmpty(result.additionalUserInfo)) return

        // const token = result.credential.accessToken
        const profile = createUser(result.additionalUserInfo.profile)

        const isNewUser = get(result, 'additionalUserInfo.isNewUser', false)

        if (isNewUser) {
          await dispatch(SAVE_USER, profile)
        }
      } catch (err) {
        console.error(HANDLE_PROVIDER_RESPONSE, err)
        commit(SET_ERROR, err)
      }
    },
    async [SAVE_USER]({ commit, state }, profile = {}) {
      const { currentUser } = state
      try {
        await usersColRef.doc(currentUser).set(profile)
      } catch (err) {
        console.error('SAVE_USER action error: ', err)
        commit(SET_ERROR, err)
      }
    },
    async [LOGOUT]({ commit }) {
      try {
        await auth.signOut()
        commit(SET_LOGOUT)
      } catch (err) {
        commit(SET_ERROR, err)
      }
    }
  },
  mutations: {
    [SET_USER](state, user) {
      // eslint-disable-next-line
      state.currentUser = user
    },
    [SET_USER_DETAILS](state, userDetails) {
      // eslint-disable-next-line
      state.userDetails = userDetails
    },
    [SET_LOGOUT](state) {
      // eslint-disable-next-line
      state.currentUser = null
    }
  }
}
