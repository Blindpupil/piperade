<template>
  <v-dialog
    v-model="addIngredientDialog"
    fullscreen
    hide-overlay
    transition="dialog-bottom-transition"
  >
    <slot slot="activator"></slot>

    <v-card tile>
      <v-toolbar card>
        <v-btn icon @click="goToPreviousDialog">
          <v-icon>arrow_back</v-icon>
        </v-btn>
        <v-toolbar-title>Ingredient for "{{recipeName}}"</v-toolbar-title>
      </v-toolbar>

      <v-card-text>
        <v-container grid-list-md>
          <v-layout wrap>
            <v-flex xs12 mb-3>
              <v-form ref="ingredientForm" v-model="validIngredient">
                <v-combobox
                  v-model="ingredient"
                  :rules="ingredientRules"
                  :placeholder="ingredientsList[0]"
                  :items="ingredientsList"
                  label="Select ingredient or create a new one"
                ></v-combobox>

                <v-text-field
                  v-model="quantity"
                  placeholder="2"
                  :rules="quantityRules"
                  label="Quantity"
                ></v-text-field>

                <v-select
                  v-model="unit"
                  :placeholder="unitsList[0]"
                  :items="unitsList"
                  label="Select unit"
                ></v-select>

                <v-spacer class="my-4"></v-spacer>

                <v-combobox
                  class="font-weight-light"
                  v-model="substituteIngredient"
                  :rules="substituteIngredientRules"
                  :items="ingredientsList"
                  :label="`If you can't find ${ingredient}, is there any replacements?`"
                ></v-combobox>
              </v-form>
            </v-flex>
          </v-layout>
        </v-container>
      </v-card-text>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="primary" @click="validateIngredient"> Add </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { isEmpty } from 'lodash-es'
import { mapGetters, mapMutations } from 'vuex'
import { SET_INGREDIENTS } from '@/store/types/mutation_types'

export default {
  data: () => ({
    addIngredientDialog: false,
    activator: null,
    ingredient: '',
    ingredientsList: ['Garlic', 'Onions', 'Tomatoes', 'Red Bell Peppers', 'Eggs'],
    quantity: '',
    unit: '',
    ingredientRules: [
      v => !isEmpty(v.trim()) || 'Ingredient needs a name',
      v => v.length <= 20 || 'Ingredient name must be less than 20 characters'
    ],
    quantityRules: [
      v => v > 0 || 'Gotta be a number bigger than 0'
    ],
    substituteIngredient: '',
    substituteIngredientRules: [
      v => v.length <= 20 || 'Ingredient name must be less than 20 characters'
    ],
    unitsList: ['cloves', 'units', 'cl', 'g', 'k', 'l', 'lbs', 'ml', 'oz'],
    validIngredient: false
  }),
  computed: {
    ...mapGetters(['recipeName'])
  },
  methods: {
    ...mapMutations({
      setIngredients: SET_INGREDIENTS
    }),
    goToPreviousDialog() {
      this.addIngredientDialog = false
    },
    validateIngredient() {
      if (this.$refs.ingredientForm.validate()) {
        this.snackbar = true

        const data = {
          ingredient: {
            ingredient: this.ingredient,
            quantity: this.quantity,
            unit: this.unit || 'units',
            substitute: this.substituteIngredient || ''
          },
          isNew: true
        }

        this.setIngredients(data)

        this.goToPreviousDialog()
      }
    }
  }
}
</script>
