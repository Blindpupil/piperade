<template>
  <v-dialog
    v-model="addIngredientDialog"
    transition="dialog-bottom-transition"
    persistent
  >
    <slot slot="activator"></slot>

    <v-card tile>
      <v-toolbar card>
        <v-btn icon @click="goToPreviousDialog">
          <v-icon>arrow_back</v-icon>
        </v-btn>
        <v-toolbar-title>Ingredient for {{recipeName}}</v-toolbar-title>
      </v-toolbar>

      <v-card-text>
        <v-container grid-list-md>
          <v-layout wrap>
            <v-flex xs12 mb-3>
              <v-form ref="ingredientForm" v-model="validIngredient">
                <v-combobox
                  v-model="ingredient"
                  :items="ingredientsList"
                  :placeholder="ingredientsList[0]"
                  :rules="ingredientRules"
                  @input.native="handleChange"
                  name="ingredient"
                  label="Select ingredient or create a new one"
                ></v-combobox>

                <v-text-field
                  v-model="quantity"
                  :rules="quantityRules"
                  label="Quantity"
                  placeholder="2"
                ></v-text-field>

                <v-select
                  v-model="unit"
                  :placeholder="unitsList[0]"
                  :items="unitsList"
                  label="Select unit"
                ></v-select>

                <v-spacer class="my-4"></v-spacer>

                <v-combobox
                  v-model="substitute"
                  :rules="substituteIngredientRules"
                  :items="ingredientsList"
                  :placeholder="`If you can't find the ingredient`"
                  @input.native="handleChange"
                  name="substitute"
                  label="Substitute"
                  class="font-weight-light"
                ></v-combobox>
              </v-form>
            </v-flex>
          </v-layout>
        </v-container>
      </v-card-text>

      <v-card-actions style="padding: 16px 32px">
        <v-btn color="primary" class="w100" @click="validateIngredient"> Add </v-btn>
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
    ingredientsList: ['Garlic', 'Onions', 'Tomatoes', 'Red Bell Peppers', 'Eggs'],
    // input.native doesn't work in Combobox unless I nest data
    data: {},
    quantity: '',
    unit: '',
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
    ...mapGetters(['recipeName', 'unitsList']),
    ingredient: {
      get() {
        return (isEmpty(this.data.ingredient))
          ? ''
          : this.data.ingredient
      },
      set(newValue) {
        this.data.ingredient = newValue
      }
    },
    substitute: {
      get() {
        return (isEmpty(this.data.substitute))
          ? ''
          : this.data.substitute
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
    handleChange(e) {
      if (!isEmpty(e)) {
        const newValue = e.srcElement.value
        const property = e.srcElement.name

        this.data[property] = newValue
      }
    },
    goToPreviousDialog() {
      this.addIngredientDialog = false
    },
    validateIngredient() {
      if (this.$refs.ingredientForm.validate()) {
        this.snackbar = true

        const data = {
          ingredient: {
            ingredient: this.data.ingredient,
            quantity: this.quantity,
            unit: this.unit || 'units',
            substitute: this.data.substitute || ''
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
