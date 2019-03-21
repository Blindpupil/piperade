<template>
  <v-dialog
    v-model="addRecipeToLists"
    width="500"
  >
    <slot slot="activator"></slot>

    <v-card>
      <v-card-title style="text-transform: none" class="headline grey lighten-2" primary-title>
        In which lists should we add {{ recipe.name }}?
      </v-card-title>

      <v-container fluid grid-list-md>
        <v-layout row wrap>
          <v-flex v-for="list in lists" :key="list.id">
            <v-card
              @click="toggle(list)"
              :class="{'clickable': !recipeAlreadyInList(list)}"
              :flat="flats[list.id] || false"
            >
              <v-card-title
                v-text="list.name"
                class="pb-1 small-card-text capitalize text-center text-brand-gray"
              ></v-card-title>
              <v-card-text class="pt-1">
                <div v-if="recipeAlreadyInList(list)">
                  This list already contains this recipe.
                  If you'd like to cook it several times, simply increment its portions in the list.
                </div>
                <div v-else-if="recipeNames(list)">
                  <span> This list includes: </span>
                  <p class="capitalize ma-0" v-text="recipeNames(list)"></p>
                </div>
                <div v-else>
                  <span> No recipes in this list yet </span>
                </div>
              </v-card-text>
            </v-card>
          </v-flex>
        </v-layout>
      </v-container>

      <v-divider></v-divider>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn
          @click="saveRecipeInLists"
          :color="nothingAdded ? '' : 'primary'"
          :flat="nothingAdded"
        >
          {{ nothingAdded ? 'Close' : 'Add Recipe' }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { isEmpty } from 'lodash-es'
import { mapState } from 'vuex'

import { WRITE_LIST } from '@/store/types/action_types'


export default {
  props: {
    recipe: Object
  },
  data() {
    return {
      added: {},
      flats: {},
      addRecipeToLists: false
    }
  },
  computed: {
    ...mapState({
      lists: state => state.list.lists,
      recipes: state => state.recipe.recipes
    }),
    nothingAdded() {
      return isEmpty(this.added)
    }
  },
  methods: {
    computeListRecipes(listRecipes) {
      let result = []

      if (!isEmpty(listRecipes) && !isEmpty(this.recipes) && typeof listRecipes[0] === 'string') {
        // we have recipe ids
        listRecipes.forEach((id) => {
          const match = this.recipes.find(o => o.id === id)
          result.push(match)
        })
      } else {
        // we have recipe objects
        result = listRecipes
      }
      return result
    },
    getArrayOfRecipeNamesInList(list) {
      const names = []
      const listRecipes = this.computeListRecipes(list.recipes)
      if (!isEmpty(listRecipes)) {
        listRecipes.forEach(recipe => names.push(recipe.name))
      }

      return names
    },
    recipeAlreadyInList(list) {
      const listRecipeNames = this.getArrayOfRecipeNamesInList(list)
      return listRecipeNames.includes(this.recipe.name)
    },
    recipeNames(list) {
      const listRecipeNames = this.getArrayOfRecipeNamesInList(list)
      return listRecipeNames.join(', ')
    },
    toggle(list) {
      const disabled = this.recipeAlreadyInList(list)

      if (this.added[list.id]) {
        this.$set(this.flats, list.id, false)
        this.$delete(this.added, list.id)
      } else if (!disabled) {
        this.$set(this.flats, list.id, true)
        this.$set(this.added, list.id, list)
      }
    },
    async saveRecipeInLists() {
      const lists = Object.values(this.added)

      if (!isEmpty(lists)) {
        const { id } = this.recipe

        const newLists = lists.map((list) => {
          const newList = {}
          const previusRecipes = list.recipes || []

          Object.assign(newList, list, { recipes: [...previusRecipes, id] })
          return newList
        })

        await newLists.forEach(list => this.$store.dispatch(WRITE_LIST, list))
      }

      this.addRecipeToLists = false
    }
  }
}
</script>
