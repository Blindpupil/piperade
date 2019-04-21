<template>
  <div>
    <p v-if="recipeIngredients.length === 0" class="ma-4">
      You haven't added any ingredients yet...
    </p>
    <v-layout
      v-for="(ingredient, index) in recipeIngredients"
      row align-center
      :key="index"
    >
      <v-flex xs1>
        <WriteIngredientDialog :ingredient="ingredient">
          <v-icon>
            edit
          </v-icon>
        </WriteIngredientDialog>
      </v-flex>

      <v-flex xs10>
        <v-list two-line class="py-0">
          <v-list-tile
            :key="ingredient.ingredient"
            avatar ripple
          >
            <v-list-tile-content>
              <v-list-tile-title>
                {{ ingredient.ingredient }}
              </v-list-tile-title>
            </v-list-tile-content>

            <v-list-tile-action class="ingredient-quantity">
              <v-list-tile-action-text>
                {{ ingredient.quantity }} {{ ingredient.unit }}
              </v-list-tile-action-text>
            </v-list-tile-action>
          </v-list-tile>
        </v-list>
      </v-flex>

      <v-flex xs1>
        <v-icon
          @click="removeIngredient(index)"
          color="grey lighten-1"
        >
          delete_outline
        </v-icon>
      </v-flex>
      <v-divider v-if="index + 1 < recipeIngredients.length" :key="index"></v-divider>
    </v-layout>
  </div>
</template>

<script>
import { mapGetters, mapState } from 'vuex'
import { SET_RECIPE } from '@/store/types/mutation_types'

import WriteIngredientDialog from '@/components/molecules/WriteIngredientDialog.vue'

export default {
  components: {
    WriteIngredientDialog
  },
  computed: {
    ...mapGetters(['recipeIngredients']),
    ...mapState({
      recipe: state => state.recipe.recipe
    })
  },
  methods: {
    removeIngredient(index) {
      const ingredients = this.recipeIngredients
      ingredients.splice(index, 1)

      const recipe = {
        ...this.recipe,
        ingredients
      }
      this.$store.commit(SET_RECIPE, recipe)
    }
  }
}
</script>

<style lang="scss">
.ingredient-quantity span {
  font-size: 13px;
}
</style>
