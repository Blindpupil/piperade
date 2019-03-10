import Vue from 'vue'
import Router from 'vue-router'

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
          component: () => import('@/components/pages/Recipes.vue')
        },
        {
          path: 'pantry',
          component: () => import('@/components/pages/Pantry.vue')
        },
        {
          path: 'lists',
          component: () => import('@/components/pages/Lists.vue')
        },
        {
          path: 'calendar',
          component: () => import('@/components/pages/Calendar.vue')
        }
      ]
    }
  ]
})
