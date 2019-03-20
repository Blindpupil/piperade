import Vue from 'vue'
import Router from 'vue-router'

import Recipes from '@/components/pages/Recipes.vue'
import Pantry from '@/components/pages/Pantry.vue'
import Lists from '@/components/pages/Lists.vue'
import Calendar from '@/components/pages/Calendar.vue'

Vue.use(Router)

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
      path: '/dashboard',
      component: () => import('@/views/Dashboard.vue'),
      children: [
        {
          path: '/',
          component: Recipes
        },
        {
          path: 'pantry',
          component: Pantry
        },
        {
          path: 'lists',
          component: Lists
        },
        {
          path: 'calendar',
          component: Calendar
        }
      ]
    }
  ]
})
