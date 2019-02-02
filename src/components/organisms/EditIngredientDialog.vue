<template>
  <v-dialog
    v-model="editDialog"
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
        <v-toolbar-title>Editing {{ingredient}} in "{{recipeName}}"</v-toolbar-title>
      </v-toolbar>

      <v-card-text>
        <v-container grid-list-md>
          <v-layout wrap>
            <v-flex xs12 mb-3>
              <v-form ref="editIngredientForm" v-model="validIngredient">
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
        <v-btn color="error" @click="deleteIngredient"> Delete </v-btn>
        <v-spacer></v-spacer>
        <v-btn color="primary" @click="validateIngredient"> Edit </v-btn>
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
    editDialog: false,
    activator: null,
    data: {},
    ingredientsList: ['Garlic', 'Onions', 'Tomatoes', 'Red Bell Peppers', 'Eggs'],
    ingredientRules: [
      v => !isEmpty(v.trim()) || 'Ingredient needs a name',
      v => v.length <= 20 || 'Ingredient name must be less than 20 characters'
    ],
    quantityRules: [
      v => v > 0 || 'Gotta be a number bigger than 0'
    ],
    unitsList: ['cloves', 'units', 'cl', 'g', 'k', 'l', 'lbs', 'ml', 'oz'],
    substituteIngredientRules: [
      v => v.length <= 20 || 'Ingredient name must be less than 20 characters'
    ],
    validIngredient: false
  }),
  computed: {
    ...mapGetters(['editIngredientDialog', 'recipeName', 'ingredientEdit']),
    ingredient: {
      get() {
        return (isEmpty(this.ingredientEdit.ingredient))
          ? ''
          : this.ingredientEdit.ingredient
      },
      set(newValue) {
        this.data.ingredient = newValue
      }
    },
    quantity: {
      get() {
        return (isEmpty(this.ingredientEdit.quantity))
          ? ''
          : this.ingredientEdit.quantity
      },
      set(newValue) {
        this.data.quantity = newValue
      }
    },
    unit: {
      get() {
        return (isEmpty(this.ingredientEdit.unit))
          ? ''
          : this.ingredientEdit.unit
      },
      set(newValue) {
        this.data.unit = newValue
      }
    },
    substituteIngredient: {
      get() {
        return (isEmpty(this.ingredientEdit.substitute))
          ? ''
          : this.ingredientEdit.substitute
      },
      set(newValue) {
        this.data.substitute = newValue
      }
    }
  },
  methods: {
    ...mapMutations({
      setIngredients: SET_INGREDIENTS
    }),
    goToPreviousDialog() {
      this.editDialog = false
    },
    validateIngredient() {
      if (this.$refs.editIngredientForm.validate()) {
        this.snackbar = true

        const newIngredient = {
          ingredient: {
            ingredient: this.data.ingredient
              ? this.data.ingredient
              : this.ingredientEdit.ingredient,
            quantity: this.data.quantity
              ? this.data.quantity
              : this.ingredientEdit.quantity,
            unit: this.data.unit,
            substitute: this.data.substitute
          },
          index: this.ingredientEdit.index,
          isNew: false
        }

        this.setIngredients(newIngredient, this.index)

        this.goToPreviousDialog()
      }
    },
    deleteIngredient() {
      this.setIngredients({
        ingredient: {},
        index: this.ingredientEdit.index,
        isNew: false
      })

      this.goToPreviousDialog()
    }
  }
}
</script>
