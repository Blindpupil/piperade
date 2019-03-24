<template>
  <v-dialog
    v-model="writeDialog"
    transition="dialog-bottom-transition"
    persistent
  >
    <slot slot="activator"></slot>

    <v-card tile>
      <v-toolbar card>
        <v-btn icon @click="closeDialog">
          <v-icon>arrow_back</v-icon>
        </v-btn>
        <v-toolbar-title v-if="ingredient">
          {{ingredient.ingredient}} in {{recipe.name}}
        </v-toolbar-title>
        <v-toolbar-title v-else>
          Ingredient for {{recipe.name}}
        </v-toolbar-title>
      </v-toolbar>

      <v-card-text>
        <v-container grid-list-md>
          <v-layout wrap>
            <v-flex xs12 mb-3>
              <v-form ref="writeIngredientForm" v-model="validIngredient">
                <v-combobox
                  v-model="newIngredient"
                  :rules="ingredientRules"
                  :items="ingredientsList"
                  @input.native="handleChange"
                  name="ingredient"
                  label="Select ingredient or create a new one"
                ></v-combobox>

                <v-text-field
                  v-model="quantity"
                  :rules="quantityRules"
                  label="Quantity"
                ></v-text-field>

                <v-select
                  v-model="unit"
                  :items="unitsList"
                  label="Select unit"
                ></v-select>
              </v-form>
            </v-flex>
          </v-layout>
        </v-container>
      </v-card-text>

      <v-card-actions class="justify-end" style="padding: 16px 32px">
        <v-btn color="primary" @click="validateIngredient"> Save </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { get, isEmpty } from 'lodash-es'
import { mapState } from 'vuex'
import { SET_RECIPE } from '@/store/types/mutation_types'


export default {
  props: {
    ingredient: Object
  },
  data: () => ({
    writeDialog: false,
    activator: null,
    data: {},
    ingredientRules: [
      v => !isEmpty(v.trim()) || 'Ingredient needs a name',
      v => v.length <= 20 || 'Ingredient name must be less than 20 characters'
    ],
    quantityRules: [
      v => v > 0 || 'Gotta be a number bigger than 0'
    ],
    validIngredient: false
  }),
  computed: {
    ...mapState({
      recipe: state => state.recipe.recipe,
      unitsList: state => state.pantry.unitsList,
      ingredientsList: state => state.pantry.ingredientsList
    }),
    newIngredient: {
      get() {
        if (this.ingredient) {
          return (isEmpty(this.ingredient.ingredient))
            ? ''
            : this.ingredient.ingredient
        }
        return ''
      },
      set(newValue) {
        this.data.ingredient = newValue.toLowerCase()
      }
    },
    quantity: {
      get() {
        if (this.ingredient) {
          return (isEmpty(this.ingredient.quantity))
            ? ''
            : this.ingredient.quantity
        }
        return ''
      },
      set(newValue) {
        this.data.quantity = newValue
      }
    },
    unit: {
      get() {
        if (this.ingredient) {
          return (isEmpty(this.ingredient.unit))
            ? ''
            : this.ingredient.unit
        }
        return ''
      },
      set(newValue) {
        this.data.unit = newValue
      }
    }
  },
  methods: {
    closeDialog() {
      this.writeDialog = false
    },
    handleChange(e) {
      if (!isEmpty(e)) {
        const newValue = e.srcElement.value
        const property = e.srcElement.name

        this.data[property] = newValue.toLowerCase()
      }
    },
    validateIngredient() {
      if (this.$refs.writeIngredientForm.validate()) {
        this.snackbar = true

        const ingredients = Object.assign({}, this.recipe.ingredients)

        const unit = get(this.ingredient, 'unit', 'units')

        const ingredient = {
          ...this.ingredient,
          ...this.data,
          unit: this.data.unit ? this.data.unit : unit
        }

        const oldKey = this.ingredient ? this.ingredient.ingredient.toLowerCase() : false
        const key = this.data.ingredient ? this.data.ingredient.toLowerCase() : oldKey

        delete ingredients[oldKey]

        ingredients[key] = ingredient

        this.$store.commit(SET_RECIPE, {
          ...this.recipe,
          ingredients
        })

        this.closeDialog()
      }
    }
  }
}
</script>
