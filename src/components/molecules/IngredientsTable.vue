<template>
  <v-card light class="mb-2">
    <v-card-title><h4>Ingredients</h4></v-card-title>
    <v-divider></v-divider>
    <v-list dense>
      <v-list-tile
        v-for="ingredient in Object.values(recipe.ingredients)"
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
    recipe: Object
  },
  methods: {
    wasup(stuff) {
      console.log(stuff)
    }
  }
}
</script>
