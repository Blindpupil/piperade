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
        <v-list-tile-content>
          {{ ingredient.ingredient }}
        </v-list-tile-content>
        <v-list-tile-content class="align-end blue-grey--text">
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
