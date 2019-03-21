<template>
  <v-card>
    <v-card-title primary-title @click="setList">
      <ListDialog>
        <div class="headline">{{ list.name }}</div>
        <p class="text-brand-gray">
          {{ date(list.edited) }}
        </p>
        <span v-if="recipeNames" class="pr-1 capitalize">
          {{ recipeNames }}
        </span>
        <span v-else>
          You haven't added recipes in this list yet
        </span>
      </ListDialog>
    </v-card-title>

    <v-divider light></v-divider>

    <v-card-actions class="pa-2">
      <v-layout align-center px-2>
        <v-menu bottom left>
          <v-btn slot="activator" class="more-button" icon>
            <v-icon>more_horiz</v-icon>
          </v-btn>

          <v-list>
            <v-list-tile @click="deleteList(list)">
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
</template>

<script>
import { DELETE_LIST } from '@/store/types/action_types'
import { SET_LIST } from '@/store/types/mutation_types'

import ListDialog from '@/components/organisms/List/ListDialog.vue'


export default {
  components: {
    ListDialog
  },
  props: {
    list: Object
  },
  computed: {
    recipeNames() {
      const names = []
      this.list.recipes.forEach(recipe => names.push(recipe.name))

      return names.join(' | ')
    }
  },
  methods: {
    date(timestamp) {
      return timestamp ? timestamp.toDate().toDateString() : ''
    },
    setList() {
      this.$store.commit(SET_LIST, this.list)
    },
    deleteList(list) {
      this.$store.dispatch(DELETE_LIST, list)
    }
  }
}
</script>
