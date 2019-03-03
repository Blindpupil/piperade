<template>
  <v-dialog
    v-model="editCupboardDialog"
    transition="dialog-bottom-transition"
    persistent
  >
    <slot slot="activator"></slot>

    <v-card tile>
      <v-toolbar card>
        <v-btn icon @click="goToPreviousDialog">
          <v-icon>arrow_back</v-icon>
        </v-btn>
        <v-toolbar-title>Editing {{ingredient}}</v-toolbar-title>
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
                  @input.native="handleChange"
                  name="ingredient"
                  label="Select ingredient or create a new one"
                ></v-combobox>

                <v-text-field
                  v-model="quantity"
                  placeholder="2"
                  :rules="quantityRules"
                  label="Quantity"
                ></v-text-field>

                <v-text-field
                  v-model="price"
                  placeholder="4"
                  prefix="€"
                  :rules="quantityRules"
                  label="Price"
                ></v-text-field>

                <v-select
                  v-model="unit"
                  :placeholder="unitsList[0]"
                  :items="unitsList"
                  label="Select unit"
                ></v-select>
              </v-form>
            </v-flex>
          </v-layout>
        </v-container>
      </v-card-text>

      <v-card-actions style="padding: 16px 32px">
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
import { SET_CUPBOARDS } from '@/store/types/mutation_types'

export default {
  data: () => ({
    editCupboardDialog: false,
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
    substituteIngredientRules: [
      v => v.length <= 20 || 'Ingredient name must be less than 20 characters'
    ],
    validIngredient: false
  }),
  computed: {
    ...mapGetters(['ingredientEdit', 'unitsList']),
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
    price: {
      get() {
        return (isEmpty(this.ingredientEdit.price))
          ? ''
          : this.ingredientEdit.price
      },
      set(newValue) {
        this.data.price = newValue
      }
    }
  },
  methods: {
    ...mapMutations({
      setCupboards: SET_CUPBOARDS
    }),
    goToPreviousDialog() {
      this.editCupboardDialog = false
    },
    handleChange(e) {
      if (!isEmpty(e)) {
        const newValue = e.srcElement.value
        const property = e.srcElement.name

        this.data[property] = newValue
      }
    },
    validateIngredient() {
      if (this.$refs.editIngredientForm.validate()) {
        this.snackbar = true

        const newIngredient = {
          ingredient: {
            ...this.ingredientEdit,
            ...this.data
          },
          index: this.ingredientEdit.index,
          isNew: false
        }

        this.setCupboards(newIngredient, this.index)

        this.goToPreviousDialog()
      }
    },
    deleteIngredient() {
      this.setIngredients({
        ingredient: null,
        index: this.ingredientEdit.index,
        isNew: false
      })

      this.goToPreviousDialog()
    }
  }
}
</script>
