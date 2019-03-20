<template>
  <v-layout>
    <v-flex>
      <RecipesList />

      <AddRecipeDialogs>
        <v-fab-transition>
          <v-btn
            v-show="!hidden"
            @click="resetRecipeState"
            class="primary bottom-float"
            fab fixed bottom right
          >
            <v-icon>add</v-icon>
          </v-btn>
        </v-fab-transition>
      </AddRecipeDialogs>
    </v-flex>
  </v-layout>
</template>

<script>
import { RESET_RECIPE } from '@/store/types/mutation_types'

import RecipesList from '@/components/organisms/Recipe/RecipesList.vue'
import AddRecipeDialogs from '@/components/organisms/Recipe/AddRecipeDialogs.vue'


export default {
  components: {
    AddRecipeDialogs,
    RecipesList
  },
  data() {
    return {
      hidden: true
    }
  },
  created() {
    setTimeout(() => { this.hidden = false }, 100)
  },
  methods: {
    resetRecipeState() {
      this.$store.commit(RESET_RECIPE)
    }
  }
}
</script>
