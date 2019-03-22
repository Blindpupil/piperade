<template>
  <v-layout>
    <v-flex>
      <v-layout wrap align-self-baseline style="height: auto">
        <p v-show="emptyList" class="w100 mt-3 text-center"> You haven't added any lists! </p>
        <v-flex mb-2 xs12 v-for="list in fullLists" :key="list.id">
          <ListCard :list="list" />
        </v-flex>
      </v-layout>

      <AddListDialogs>
        <v-fab-transition>
          <v-btn
            v-show="!hidden"
            @click="resetListState"
            class="primary bottom-float"
            fab fixed bottom right
          >
            <v-icon>add</v-icon>
          </v-btn>
        </v-fab-transition>
      </AddListDialogs>
    </v-flex>
  </v-layout>
</template>

<script>
import { isEmpty } from 'lodash-es'
import { mapState } from 'vuex'

import { RESET_LIST } from '@/store/types/mutation_types'

import AddListDialogs from '@/components/organisms/List/AddListDialogs.vue'
import ListCard from '@/components/atoms/ListCard.vue'


export default {
  components: {
    AddListDialogs,
    ListCard
  },
  data() {
    return {
      hidden: true
    }
  },
  computed: {
    ...mapState({
      lists: state => state.list.lists,
      recipes: state => state.recipe.recipes
    }),
    fullLists() {
      const { lists, recipes } = this

      const fullLists = lists.map((list) => {
        let listRecipes = []

        if (!isEmpty(list.recipes)) {
          listRecipes = recipes.filter(recipe => list.recipes.includes(recipe.id))
        }

        return {
          ...list,
          recipes: listRecipes
        }
      })

      return fullLists
    },
    emptyList() {
      return isEmpty(this.fullLists)
    }
  },
  created() {
    setTimeout(() => { this.hidden = false }, 100)
  },
  methods: {
    resetListState() {
      this.$store.commit(RESET_LIST)
    }
  }
}
</script>
