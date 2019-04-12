<template>
  <v-layout column my-2>
    <p v-if="!list.recipes || list.recipes.length === 0" class="ma-4">
      You haven't added any recipes to this list yet...
    </p>

    <!-- Recipes items -->
    <v-expansion-panel expand>
      <v-expansion-panel-content
        class="panel-header-padding"
        v-for="(recipe, index) in list.recipes"
        :key="index"
      >
        <div slot="header" class="d-flex align-center">
          <ListRecipePortionsDialog :list="list" :recipe="recipe" class="min-flex"/>

          <div class="min-flex mr-3">
            <v-icon class="small-icon">person</v-icon>
            <span class="text-brand-gray">
              {{ recipe.listPortions ? recipe.listPortions : '?' }}
            </span>
          </div>

          <span class="body-2 capitalize">{{ recipe.name }}</span>
        </div>

        <v-card flat>
          <v-card-text style="padding: 10px">
            <IngredientsTable headless flat :ingredients="recipe.ingredients"/>
          </v-card-text>
        </v-card>
      </v-expansion-panel-content>
    </v-expansion-panel>
  </v-layout>
</template>

<script>
import IngredientsTable from '@/components/atoms/IngredientsTable.vue'
import ListRecipePortionsDialog from '@/components/molecules/ListRecipePortionsDialog.vue'


export default {
  props: {
    list: Object
  },
  components: {
    IngredientsTable,
    ListRecipePortionsDialog
  }
}
</script>

<style lang="scss">
.panel-header-padding .v-expansion-panel__header {
  padding-left: 12px;
  padding-right: 12px;
}
</style>
