<template>
  <v-dialog
    v-model="recipeItemDialog"
    transition="dialog-bottom-transition"
    fullscreen
    hide-overlay
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
            <v-btn
              color="primary"
              @click="setRecipe(recipe)"
              fab small>
              <v-icon>edit</v-icon>
            </v-btn>
          </EditRecipeDialog>
        </v-flex>
      </v-toolbar>

      <v-card-text class="py-0">
        <v-container class="pa-0">
          <v-layout column align-center>
            <!-- Categories -->
            <v-flex w100 v-if="recipe.categories">
              <v-chip
                v-for="(category, index) in recipe.categories"
                :key="index"
                :color="category.color"
              >
                {{ category.text }}
              </v-chip>
            </v-flex>

            <v-flex w100>
              <!-- Ingredients table -->
              <IngredientsTable :ingredients="Object.values(recipe.ingredients)" />
            </v-flex>

            <v-flex align-self-start class="w100">
              <v-container>
                <div class="body-2">Instructions</div>
                <p class="py-1">
                  {{ recipe.instructions }}
                </p>
              </v-container>
            </v-flex>

            <v-flex align-self-start class="w100">
              <v-list class="pt-0">
                <v-list-tile>
                  <span class="body-2">Duration</span>
                  <v-list-tile-content class="align-end">
                    <span>
                      {{
                        recipe.duration
                          ? `${recipe.duration.hours}:${recipe.duration.minutes}`
                          : '?'
                      }}
                      <v-icon class="medium-icon">access_time</v-icon>
                    </span>
                  </v-list-tile-content>
                </v-list-tile>

                <v-list-tile>
                  <span class="body-2">Portions</span>
                  <v-list-tile-content class="align-end">
                    <span>
                      {{ recipe.portions }} <v-icon class="medium-icon">person</v-icon>
                    </span>
                  </v-list-tile-content>
                </v-list-tile>
              </v-list>
            </v-flex>
          </v-layout>
        </v-container>
      </v-card-text>

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
import { SET_RECIPE } from '@/store/types/mutation_types'

import IngredientsTable from '@/components/atoms/IngredientsTable.vue'
import EditRecipeDialog from '@/components/organisms/Recipe/EditRecipeDialog.vue'


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
    close() {
      this.recipeItemDialog = false
    },
    setRecipe(recipe) {
      this.$store.commit(SET_RECIPE, recipe)
    }
  }
}
</script>

<style lang="scss">
.v-toolbar__title {
  text-transform: capitalize;
}
</style>
