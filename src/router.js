import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/views/Home.vue'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import(/* webpackChunkName: "about" */ '@/views/About.vue')
    },
    {
      path: '/dashboard',
      component: () => import('@/views/Dashboard.vue'),
      children: [
        {
          path: '/',
          component: () => import('@/components/Dashboard/Recipes.vue')
        },
        {
          path: 'pantry',
          component: () => import('@/components/Dashboard/Pantry.vue')
        },
        {
          path: 'lists',
          component: () => import('@/components/Dashboard/Lists.vue')
        },
        {
          path: 'calendar',
          component: () => import('@/components/Dashboard/Calendar.vue')
        }
      ]
    }
  ]
})
