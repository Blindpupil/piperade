<template>
  <v-layout row justify-center>
    <div @click="nameDialog = true">
      <slot></slot>
    </div>

    <NameDialog
      :nameDialog="nameDialog"
      @show:ingredientsdialog="showIngredientsDialog"
      @cancel:addrecipedialogs="cancel"
    />

    <IngredientsPortionsDialog
      :ingredientsDialog="ingredientsDialog"
      @show:detailsdialog="showDetailsDialog"
      @back:ingredientsdialog="backToName"
      @cancel:addrecipedialogs="cancel"
    />

    <DetailsDialog
      :detailsDialog="detailsDialog"
      @back:detailsdialog="backToIngredients"
      @cancel:addrecipedialogs="cancel"
    />
  </v-layout>
</template>

<script>
import NameDialog from '@/components/molecules/AddRecipeDialogs/NameDialog.vue'
import IngredientsPortionsDialog from '@/components/molecules/AddRecipeDialogs/IngredientsPortionsDialog.vue'
import DetailsDialog from '@/components/molecules/AddRecipeDialogs/DetailsDialog.vue'

import { RESET_RECIPE } from '@/store/types/mutation_types'

export default {
  components: {
    NameDialog,
    IngredientsPortionsDialog,
    DetailsDialog
  },
  data() {
    return {
      nameDialog: false,
      ingredientsDialog: false,
      detailsDialog: false
    }
  },
  methods: {
    cancel() {
      this.detailsDialog = false
      this.ingredientsDialog = false
      this.nameDialog = false

      this.$store.commit(RESET_RECIPE)
    },
    showIngredientsDialog() {
      this.ingredientsDialog = true
    },
    showDetailsDialog() {
      this.detailsDialog = true
    },
    backToName() {
      this.ingredientsDialog = false
    },
    backToIngredients() {
      this.detailsDialog = false
    }
  }
}
</script>
