<template>
  <v-dialog
    v-model="recipeItemDialog"
    transition="dialog-bottom-transition"
    hide-overlay
    fullscreen
    scrollable
  >
    <slot slot="activator"></slot>

    <v-card tile>
      <v-toolbar card>
        <v-flex>
          <div class="v-toolbar__content" style="height: 56px;">
            <v-btn icon @click="recipeItemDialog = false">
              <v-icon>arrow_back</v-icon>
            </v-btn>
            <v-toolbar-title>{{recipe.name}}</v-toolbar-title>
          </div>
        </v-flex>

        <v-flex min-flex>
          <EditRecipeDialog @close:dialog="close" :recipe="recipe">
            <v-btn color="primary" @click="setEditData" fab small>
              <v-icon>edit</v-icon>
            </v-btn>
          </EditRecipeDialog>
        </v-flex>
      </v-toolbar>

      <v-flex ma-1 min-flex v-if="recipe.categories">
        <v-chip
          v-for="(category, index) in recipe.categories"
          :key="index"
          :color="category.color"
        >
          {{ category.text }}
        </v-chip>
      </v-flex>

      <IngredientsTable :recipe="recipe" />

      <div>
        <v-card-title class="py-1"><h4>Instructions</h4></v-card-title>
        <v-card-text class="py-1">
          {{ recipe.instructions }}
        </v-card-text>
      </div>

      <v-list class="pt-0">
        <v-list-tile>
          <v-list-tile-content>Portions</v-list-tile-content>
          <v-list-tile-content class="align-end">
            {{ recipe.portions }}
          </v-list-tile-content>
        </v-list-tile>
      </v-list>

      <v-spacer></v-spacer>
      <v-divider></v-divider>

      <v-card-actions class="min-flex">
        <v-btn flat @click="close"> Close </v-btn>
        <v-spacer></v-spacer>
        <v-btn color="primary"> Add </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { mapMutations } from 'vuex'
import {
  SET_CATEGORIES,
  SET_RECIPE_NAME,
  SET_INGREDIENTS
} from '@/store/types/mutation_types'
import EditRecipeDialog from '@/components/organisms/EditRecipeDialog.vue'
import IngredientsTable from '@/components/molecules/IngredientsTable.vue'

export default {
  components: {
    EditRecipeDialog,
    IngredientsTable
  },
  props: {
    recipe: Object
  },
  data: () => ({
    recipeItemDialog: false
  }),
  methods: {
    ...mapMutations({
      setCategories: SET_CATEGORIES,
      setIngredients: SET_INGREDIENTS,
      setName: SET_RECIPE_NAME
    }),
    setEditData() {
      this.setCategories(this.recipe.categories)
      this.setIngredients({ ingredient: this.recipe.ingredients })
      this.setName(this.recipe.name)
    },
    close() {
      this.recipeItemDialog = false
    }
  }
}
</script>

<style lang="scss">
.v-toolbar__title {
  text-transform: capitalize;
}
</style>
