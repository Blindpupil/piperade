import Vue from 'vue'
import Vuex from 'vuex'

import recipe from '@/store/modules/recipe_module'
import pantry from '@/store/modules/pantry_module'
import list from '@/store/modules/list_module'
import alert from '@/store/modules/alert_module'
import loading from '@/store/modules/loading_module'
import user from '@/store/modules/user_module'

Vue.use(Vuex)

export default new Vuex.Store({
  strict: true,
  modules: {
    alert,
    list,
    loading,
    pantry,
    recipe,
    user
  }
})
