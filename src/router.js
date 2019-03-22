import Vue from 'vue'
import Router from 'vue-router'
import { get, isEmpty } from 'lodash-es'

import store from '@/store'
import { SET_ERROR } from '@/store/types/mutation_types'
import { SESSION, HANDLE_PROVIDER_RESPONSE } from '@/store/types/action_types'

import Recipes from '@/components/pages/Recipes.vue'
import Pantry from '@/components/pages/Pantry.vue'
import Lists from '@/components/pages/Lists.vue'
import Calendar from '@/components/pages/Calendar.vue'

Vue.use(Router)

async function requireAuth(to, from, next) {
  try {
    // Required to maintain the session
    await store.dispatch(SESSION)
    const currentUser = get(store, 'state.user.currentUser', null)

    if (isEmpty(currentUser)) {
      next({ path: '/login', replace: true })
    } else {
      next()
    }
  } catch (err) {
    store.commit(SET_ERROR, err)
    console.error('error in requireAuth.', err)
  }
}
// When you log in through a Provider it takes you back to the login page.
// This is the function that redirects to the dashboard if login worked
async function checkForExistingSession(to, from, next) {
  try {
    // TODO: replace for a fullpage loader or see if you can use 'getredirectresult'
    // https://firebase.google.com/docs/reference/js/firebase.auth.Auth.html#getredirectresult
    // (currently stays in a whitescreen for long)
    await store.dispatch(SESSION)
    const currentUser = get(store, 'state.user.currentUser', null)

    if (!isEmpty(currentUser)) {
      store.dispatch(HANDLE_PROVIDER_RESPONSE)
      next({ path: '/dashboard', replace: true })
    } else {
      next()
    }
  } catch (err) {
    store.commit(SET_ERROR, err)
    console.error('error in requireAuth.', err)
  }
}

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'home',
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import(/* webpackChunkName: "home" */ '@/views/Home.vue')
    },
    {
      path: '/about',
      name: 'about',
      component: () => import('@/views/About.vue')
    },
    {
      path: '/login',
      name: 'login',
      beforeEnter: (to, from, next) => checkForExistingSession(to, from, next),
      component: () => import('@/views/Login.vue')
    },
    {
      path: '/dashboard',
      beforeEnter: (to, from, next) => requireAuth(to, from, next),
      component: () => import('@/views/Dashboard.vue'),
      children: [
        {
          path: '/',
          name: 'recipes',
          component: Recipes
        },
        {
          path: 'pantry',
          name: 'pantry',
          component: Pantry
        },
        {
          path: 'lists',
          name: 'lists',
          component: Lists
        },
        {
          path: 'calendar',
          name: 'calendar',
          component: Calendar
        }
      ]
    }
  ]
})
