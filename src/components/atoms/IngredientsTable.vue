<template>
  <v-card :flat="flat" light class="mb-2">
    <div :class="headless ? 'd-none': ''">
      <v-card-title><h4>Ingredients</h4></v-card-title>
      <v-divider></v-divider>
    </div>
    <v-list dense>
      <v-list-tile
        v-for="ingredient in ingredients"
        :key="ingredient.ingredient"
      >
        <v-list-tile-content :class="{'success--text': ingredient.obtained}">
          {{ ingredient.ingredient }}
        </v-list-tile-content>
        <v-list-tile-content
          :class="ingredient.obtained ? 'success--text' : 'blue-grey--text'"
          class="align-end"
        >
          {{ ingredient.quantity }} {{ ingredient.unit }}
        </v-list-tile-content>
      </v-list-tile>
    </v-list>
  </v-card>
</template>

<script>
export default {
  props: {
    flat: Boolean,
    headless: Boolean,
    ingredients: Array
  }
}
</script>
