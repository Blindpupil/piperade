<template>
  <v-flex shrink>
    <RecipesList />
    <AddRecipeDialogs>
      <v-btn fab absolute bottom right @click="resetRecipeState" class="primary add-recipe">
        <v-icon>add</v-icon>
      </v-btn>
    </AddRecipeDialogs>
  </v-flex>
</template>

<script>
import { GET_CUPBOARDS } from '@/store/types/action_types'
import { RESET_RECIPE } from '@/store/types/mutation_types'
import RecipesList from '@/components/organisms/RecipesList.vue'
import AddRecipeDialogs from '@/components/organisms/AddRecipeDialogs.vue'

export default {
  components: {
    AddRecipeDialogs,
    RecipesList
  },
  created() {
    this.$store.dispatch(GET_CUPBOARDS)
  },
  methods: {
    resetRecipeState() {
      this.$store.commit(RESET_RECIPE)
    }
  }
}
</script>

<style lang="scss">
.add-recipe {
  bottom: 5rem !important;
}
</style>
