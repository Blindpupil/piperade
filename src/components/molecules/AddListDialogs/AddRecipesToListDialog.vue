<template>
  <v-dialog
    v-model="addRecipesToList"
    width="500"
  >
    <slot slot="activator"></slot>

    <v-card>
      <v-card-title style="text-transform: none" class="headline grey lighten-2" primary-title>
        Pick recipes for {{ list.name }}
      </v-card-title>

      <v-container fluid grid-list-md>
        <v-layout row wrap>
          <v-flex v-for="recipe in recipes" :key="recipe.id" xs4>
            <v-card @click="toggle(recipe)" :flat="flats[recipe.id] || false">
              <v-img
                :src="recipe.photo || 'https://hunanchinesefood.ca/img/placeholders/xcomfort_food_placeholder.png,qv=1.pagespeed.ic.mWp7cl8OIL.webp'"
                height="60"
              ></v-img>
              <v-card-text
                v-text="recipe.name"
                class="pa-1 small-card-ellipsis capitalize text-center text-brand-gray"
              ></v-card-text>
            </v-card>
          </v-flex>
        </v-layout>
      </v-container>

      <v-divider></v-divider>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn @click="saveRecipesInList" color="primary">
          Save Recipes
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { isEmpty } from 'lodash-es'
import { mapState } from 'vuex'

import { PARSE_LIST_ITEMS } from '@/store/types/action_types'


export default {
  props: {
    list: Object
  },
  data() {
    return {
      flats: {},
      added: {},
      addRecipesToList: false
    }
  },
  watch: {
    list(newVal) {
      if (!isEmpty(newVal.recipes)) {
        newVal.recipes.forEach((recipe) => {
          if (recipe.id) {
            Object.assign(this.added, { [recipe.id]: recipe })
            Object.assign(this.flats, { [recipe.id]: true })
          }
        })
      }
    }
  },
  computed: {
    ...mapState({
      recipes: state => state.recipe.recipes
    })
  },
  methods: {
    toggle(item) {
      if (this.added[item.id]) {
        this.$delete(this.flats, item.id)
        this.$delete(this.added, item.id)
      } else if (item.id) {
        this.$set(this.added, item.id, item)
        this.$set(this.flats, item.id, true)
      }
    },
    saveRecipesInList() {
      const recipes = Object.values(this.added)
      const list = {
        ...this.list,
        recipes
      }

      this.$store.dispatch(PARSE_LIST_ITEMS, list)

      this.addRecipesToList = false
    }
  }
}
</script>

<style lang="scss">
@import '@/assets/theme/index.scss';

.small-card-ellipsis {
  @include ellipsis(50px, 2)
}
</style>
