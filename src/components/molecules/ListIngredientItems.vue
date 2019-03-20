<template>
  <v-flex>
    <div v-show="!ingredients" class="ma-4">
      <p> Add recipes and we'll tell you what you need. </p>
      Use the
      <v-icon class="small-icon">add_circle</v-icon>
      button at the top right corner
      <v-icon class="medium-icon">trending_up</v-icon>
    </div>
    <v-list v-for="(item, index) in ingredients" :key="index" class="small-list-item pa-0">
      <v-list-tile
        :key="item.ingredient"
        @click="toggle(item, index)"
        avatar ripple
      >
        <v-list-tile-content>
          <v-list-tile-title :class="{'success--text': item.obtained}">
            {{ item.ingredient }}
          </v-list-tile-title>
        </v-list-tile-content>

        <v-list-tile-action class="ingredient-quantity">
          <v-list-tile-action-text :class="{'success--text': item.obtained}">
            <span v-if="item.obtained">
              got it
            </span>
            <span v-else>
              {{ item.missing }} {{ item.unit }}
            </span>
          </v-list-tile-action-text>
        </v-list-tile-action>
      </v-list-tile>
    </v-list>
  </v-flex>
</template>

<script>
import { ADDED_CUPBOARD_FROM_LIST, REMOVED_CUPBOARD_FROM_LIST } from '@/store/types/mutation_types'
import { DELETE_CUPBOARD, WRITE_CUPBOARDS } from '@/store/types/action_types'

export default {
  props: {
    ingredients: Array
  },
  methods: {
    toggle(item) {
      if (item.obtained) {
        this.$store.dispatch(DELETE_CUPBOARD, item)
        this.$store.commit(REMOVED_CUPBOARD_FROM_LIST, item)
      } else {
        this.$store.dispatch(WRITE_CUPBOARDS, {
          cupboardItems: item,
          isNew: false
        })
        this.$store.commit(ADDED_CUPBOARD_FROM_LIST, item)
      }

      this.$forceUpdate()
    }
  }
}
</script>

<style lang="scss">
.small-list-item {
  height: 100%;
  .v-list__tile {
    height: inherit;
  }
  a {
    font-size: 14px;
    padding: 4px 0;
  }
}
</style>
