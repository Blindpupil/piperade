<template>
  <div class="fill-height">
    <h2 class="px-1">Recipes</h2>

    <v-layout v-if="isLoading" style="height: 97%" align-center justify-center>
      <Loader />
    </v-layout>

    <v-flex v-else-if="!recipes.length">
      <p class="text-center mt-3">You have no recipes saved... yet!</p>
    </v-flex>

    <div v-else class="masonry-container" :style="`height: ${masonryHeight}px`">
      <div
        v-for="recipe in recipes"
        :key="recipe.id"
        ref="card"
        class="masonry-item"
      >
        <v-card class="recipe-card">
          <RecipeItemDialog :recipe="recipe" class="d-block">
            <div v-if="hasImage(recipe)">
              <v-img
                :src="recipe.photo"
                @load="imageLoad"
                ref="image"
                class="recipe-card-image"
              ></v-img>

              <v-layout px-3 justify-end>
                <div>
                  <v-icon class="small-icon">person</v-icon>
                  <span class="text-brand-gray">
                    {{ recipe.portions ? recipe.portions : '?' }}
                  </span>
                </div>
                <div class="px-2">
                  <v-icon class="small-icon">access_time</v-icon>
                  <span class="text-brand-gray">
                    {{
                      recipe.duration
                        ? `${recipe.duration.hours}:${recipe.duration.minutes}`
                        : '?'
                    }}
                  </span>
                </div>
                <div>
                  <v-icon class="small-icon">payment</v-icon>
                  <span class="text-brand-gray">
                    {{ recipe.price ? recipe.price : '?€' }}
                  </span>
                </div>
              </v-layout>

              <v-card-title primary-title>
                <div>
                  <div class="recipe-card-title">{{ recipe.name }}</div>
                  <div class="multiline-ellipsis">
                    <p class="text-brand-gray">{{ categoriesString(recipe) }}</p>
                  </div>
                </div>
              </v-card-title>
            </div>

            <v-card-title primary-title v-else>
              <div>
                <div class="headline">{{ recipe.name }}</div>

                <v-layout justify-end>
                  <div>
                    <v-icon class="small-icon">person</v-icon>
                    <span class="text-brand-gray">
                      {{ recipe.portions ? recipe.portions : '?' }}
                    </span>
                  </div>
                  <div class="px-2">
                    <v-icon class="small-icon">access_time</v-icon>
                    <span class="text-brand-gray">
                      {{
                        recipe.duration
                          ? `${recipe.duration.hours}:${recipe.duration.minutes}`
                          : '?'
                      }}
                    </span>
                  </div>
                  <div>
                    <v-icon class="small-icon">payment</v-icon>
                    <span class="text-brand-gray">
                      {{ recipe.price ? recipe.price : '?€' }}
                    </span>
                  </div>
                </v-layout>

                <div class="multiline-ellipsis">
                  <p class="text-brand-gray">{{ categoriesString(recipe) }}</p>
                </div>
              </div>
            </v-card-title>
          </RecipeItemDialog>

          <v-divider light></v-divider>

          <v-card-actions class="pa-2">
            <v-layout align-center px-2>
              <v-avatar class="small-avatar blue-grey">
                <v-menu bottom left class="px-1">
                  <v-btn slot="activator" class="more-button" icon>
                    <v-icon class="small-icon" style="color: white">add</v-icon>
                  </v-btn>

                  <v-list>
                    <v-list-tile>
                      <v-icon class="small-icon pr-2">today</v-icon>
                      <v-list-tile-title>Add to calendar</v-list-tile-title>
                    </v-list-tile>

                    <AddRecipeToListsDialog class="w100" :recipe="recipe">
                      <v-list-tile @click="''">
                        <v-icon class="small-icon pr-2">list</v-icon>
                        <v-list-tile-title>Add to list</v-list-tile-title>
                      </v-list-tile>
                    </AddRecipeToListsDialog>
                  </v-list>
                </v-menu>
              </v-avatar>

              <v-menu bottom left class="px-1">
                <v-btn slot="activator" class="more-button" icon>
                  <v-icon>more_horiz</v-icon>
                </v-btn>

                <v-list>
                  <EditRecipeDialog class="w100" :recipe="recipe">
                    <v-list-tile @click="setRecipe(recipe)">
                      <v-icon class="small-icon pr-2">edit</v-icon>
                      <v-list-tile-title>Edit</v-list-tile-title>
                    </v-list-tile>
                  </EditRecipeDialog>

                  <v-list-tile @click="deleteRecipe(recipe)">
                    <v-icon class="small-icon pr-2">delete</v-icon>
                    <v-list-tile-title style="color: crimson">Delete</v-list-tile-title>
                  </v-list-tile>
                </v-list>
              </v-menu>
            </v-layout>

            <v-layout justify-end px-2>
              <v-icon class="medium-icon">
                share
              </v-icon>
            </v-layout>
          </v-card-actions>
        </v-card>
      </div>
    </div>
  </div>
</template>

<script>
import { isEmpty } from 'lodash-es'
import { mapState } from 'vuex'

import { SET_RECIPE } from '@/store/types/mutation_types'
import { DELETE_RECIPE } from '@/store/types/action_types'

import Loader from '@/components/atoms/Loader.vue'
import AddRecipeToListsDialog from '@/components/molecules/AddListDialogs/AddRecipeToListsDialog.vue'
import EditRecipeDialog from '@/components/organisms/Recipe/EditRecipeDialog.vue'
import RecipeItemDialog from '@/components/organisms/Recipe/RecipeItemDialog.vue'

export default {
  components: {
    Loader,
    AddRecipeToListsDialog,
    EditRecipeDialog,
    RecipeItemDialog
  },
  data() {
    return {
      masonryHeight: null
    }
  },
  mounted() {
    this.getDerivedMasonryHeight()
  },
  computed: {
    ...mapState({
      recipes: state => state.recipe.recipes,
      isLoading: state => state.loading.isLoading
    })
  },
  methods: {
    categoriesString({ categories }) {
      const categoriesStrings = []

      if (!isEmpty(categories)) {
        categories.forEach(category => categoriesStrings.push(category.text))
      }

      return categoriesStrings.join(', ')
    },
    deleteRecipe(recipe) {
      this.$store.dispatch(DELETE_RECIPE, recipe)
      this.getDerivedMasonryHeight()
    },
    getInitialMasonryHeight() {
      if (isEmpty(this.recipes)) return null

      const columns = 2
      const maxRecipeHeight = 400
      const recipesLength = this.recipes.length
      const multiplier = Math.ceil(recipesLength / columns)

      const initialHeight = multiplier * maxRecipeHeight

      this.masonryHeight = initialHeight
      return initialHeight
    },
    getDerivedMasonryHeight() {
      if (isEmpty(this.$refs.card)) {
        return this.getInitialMasonryHeight()
      }

      const gutter = 16
      const columns = 2
      const recipesLength = this.recipes.length
      const firstColumnLength = Math.ceil(recipesLength / columns)

      const firstColumnHeights = []
      // eslint-disable-next-line
      for (let i = 0; i < firstColumnLength; i++) {
        firstColumnHeights.push(this.$refs.card[i].clientHeight)
      }

      const reducer = (accumulator, currentValue) => accumulator + currentValue

      const firstColumnHeight = firstColumnHeights.reduce(reducer)

      const secondColumnHeights = []
      // eslint-disable-next-line
      for (let i = firstColumnLength; i < recipesLength; i++) {
        secondColumnHeights.push(this.$refs.card[i].clientHeight)
      }

      let secondColumnHeight = 0
      if (!isEmpty(secondColumnHeights)) {
        secondColumnHeight = secondColumnHeights.reduce(reducer)
      }

      const derivedHeight = Math.max(firstColumnHeight, secondColumnHeight) + gutter

      if (derivedHeight < 500) { // images not showing mounted
        this.getInitialMasonryHeight()
      } else {
        this.masonryHeight = derivedHeight
      }
      return derivedHeight
    },
    hasImage({ photo }) {
      return !isEmpty(photo)
    },
    imageLoad() {
      this.getDerivedMasonryHeight()
    },
    setRecipe(recipe) {
      this.$store.commit(SET_RECIPE, recipe)
    }
  }
}
</script>

<style lang="scss">
@import '@/assets/theme/index.scss';

.multiline-ellipsis {
  max-width: 100%;
  @include ellipsis(3rem, 2);
}

.headline {
  text-transform: capitalize
}

.masonry-container {
  width: 100%;
  display: flex;
  flex-flow: column wrap;
  justify-content: flex-start;
  align-items: flex-start;

  .masonry-item {
    width: 49%;
    padding: 8px 4px;
  }
}

.recipe-card {
  border-radius: 5px;

  .v-card__title--primary {
    padding-top: 8px;
  }

  .v-card__title {
    padding: 8px 16px;
  }

  .recipe-card-title {
    text-align: center;
    text-transform: uppercase;
    font-weight: 500;
    font-size: 16px;
  }

  .recipe-card-image {
    border-top-left-radius: 5px;
    border-top-right-radius: 5px;
    max-height: 250px;
  }

  .more-button {
    color: rgba(0,0,0,0.54);
  }
}
</style>
