import Vue from 'vue'
import Vuex from 'vuex'
import recipe from '@/store/modules/recipe_module'
import pantry from '@/store/modules/pantry_module'

Vue.use(Vuex)

export default new Vuex.Store({
  strict: true,
  modules: {
    recipe,
    pantry
  }
})
