<template>
  <v-container grid-list-md>
    <v-layout row wrap>
      <v-flex xs12 v-for="recipe in recipes" :key="recipe.index">
        <v-card color="blue-grey darken-2" class="white--text">
          <RecipeItemDialog :recipe="recipe" class="d-block">
            <v-layout v-if="hasImage(recipe)">
              <v-flex xs5>
                <v-img
                  :src="recipe.photo"
                  height="100%"
                  contain
                ></v-img>
              </v-flex>
              <v-flex xs7>
                <v-card-title primary-title>
                  <div>
                    <div class="headline">{{ recipe.name }}</div>
                    <div class="multiline-ellipsis">
                      <p>{{ categoriesString(recipe) }}</p>
                    </div>
                    <div v-if="recipe.portions" >{{ `${recipe.portions} portions` }}</div>
                  </div>
                </v-card-title>
              </v-flex>
            </v-layout>

            <v-card-title primary-title v-else>
              <div>
                <div class="headline">{{ recipe.name }}</div>
                <div class="multiline-ellipsis">
                  <p>{{ categoriesString(recipe) }}</p>
                </div>
                <div v-if="recipe.portions" >{{ `${recipe.portions} portions` }}</div>
              </div>
            </v-card-title>
          </RecipeItemDialog>

          <v-divider light></v-divider>

          <v-card-actions class="pa-2">
            Rate it
            <v-spacer></v-spacer>
            <v-icon>star_border</v-icon>
            <v-icon>star_border</v-icon>
            <v-icon>star_border</v-icon>
            <v-icon>star_border</v-icon>
            <v-icon>star_border</v-icon>
          </v-card-actions>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import { isEmpty } from 'lodash-es'
import { mapGetters } from 'vuex'
import { GET_RECIPES } from '@/store/types/action_types'
import RecipeItemDialog from '@/components/organisms/RecipeItemDialog.vue'

export default {
  components: {
    RecipeItemDialog
  },
  created() {
    this.$store.dispatch(GET_RECIPES)
  },
  computed: {
    ...mapGetters(['recipes'])
  },
  methods: {
    hasImage({ photo }) {
      return !isEmpty(photo)
    },
    categoriesString({ categories }) {
      const categoriesStrings = []

      if (!isEmpty(categories)) {
        categories.forEach(category => categoriesStrings.push(category.text))
      }

      return categoriesStrings.join(', ')
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
</style>
