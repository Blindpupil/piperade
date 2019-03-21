<template>
  <v-layout column my-2>
    <p v-if="!listRecipes || listRecipes.length === 0" class="ma-4">
      You haven't added any recipes to this list yet...
    </p>

    <!-- Recipes items -->
    <v-expansion-panel expand>
      <v-expansion-panel-content
        v-for="(recipe, index) in computedListRecipes"
        :key="index"
      >
        <div slot="header" class="d-flex">
          <div class="min-flex pr-2">
            <v-icon class="small-icon">person</v-icon>
            <span class="text-brand-gray">
              {{ recipe.portions ? recipe.portions : '?' }}
            </span>
          </div>
          <span class="body-2 capitalize">{{ recipe.name }}</span>
        </div>
        <v-card flat>
          <v-card-text style="padding: 10px">
            <IngredientsTable headless flat :ingredients="Object.values(recipe.ingredients)"/>
          </v-card-text>
        </v-card>
      </v-expansion-panel-content>
    </v-expansion-panel>
  </v-layout>
</template>

<script>
import { isEmpty } from 'lodash-es'
import { mapState } from 'vuex'

import IngredientsTable from '@/components/atoms/IngredientsTable.vue'


export default {
  props: {
    listRecipes: Array
  },
  components: {
    IngredientsTable
  },
  computed: {
    ...mapState({
      recipes: state => state.recipe.recipes
    }),
    computedListRecipes() {
      const { listRecipes } = this
      let result = []

      if (!isEmpty(listRecipes) && typeof listRecipes[0] === 'string') {
        // we have recipe ids
        listRecipes.forEach((id) => {
          const match = this.recipes.find(o => o.id === id)
          result.push(match)
        })
      } else {
        // we have recipe objects
        result = this.listRecipes
      }
      return result
    }
  }
}
</script>
