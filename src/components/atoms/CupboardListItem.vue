<template>
  <v-slide-y-transition>
    <v-card class="my-1">
      <v-flex cupboard-list-item>
        <v-layout row my-2 px-2 align-center>
          <v-flex text-brand-gray grow>
            <v-combobox
              name="ingredient"
              v-model="ingredient"
              :items="ingredientsList"
              label="ingredient"
            ></v-combobox>
          </v-flex>
          <v-flex font-weight-bold px-2 shrink>
            <v-text-field
              v-model="quantity"
              name="quantity"
              label="quantity"
            ></v-text-field>
          </v-flex>
          <v-flex>
            <v-select
              v-model="unit"
              :items="unitsList"
              name="unit"
              label="unit"
            ></v-select>
          </v-flex>
          <v-flex shrink>
            <v-icon @click="removeItem">
              remove_circle
            </v-icon>
          </v-flex>
        </v-layout>
      </v-flex>
    </v-card>
  </v-slide-y-transition>
</template>

<script>
import { isEmpty } from 'lodash-es'
import { mapState, mapMutations } from 'vuex'

import { REMOVE_CUPBOARD, SET_ERROR, CLEAR_ERROR } from '@/store/types/mutation_types'
import { WRITE_PANTRY, DELETE_CUPBOARD } from '@/store/types/action_types'


export default {
  props: {
    cupboard: Object
  },
  data() {
    return {
      data: false,
      pantry: {
        ingredient: this.cupboard.ingredient,
        quantity: this.cupboard.quantity,
        unit: this.cupboard.unit,
        price: this.cupboard.price,
        added: this.cupboard.added
      }
    }
  },
  computed: {
    ...mapState({
      cupboards: state => state.pantry.cupboards,
      unitsList: state => state.pantry.unitsList,
      ingredientsList: state => state.ingredient.ingredientsList
    }),
    ingredient: {
      get() {
        return this.cupboard.ingredient
      },
      set(ingredient) {
        if (!isEmpty(ingredient)) {
          this.pantry.ingredient = ingredient.toLowerCase()
          this.handleChange()
        }
      }
    },
    quantity: {
      get() {
        return this.cupboard.quantity
      },
      set(quantity) {
        if (!isEmpty(quantity)) {
          this.pantry.quantity = quantity
          this.handleChange()
        }
      }
    },
    unit: {
      get() {
        return this.cupboard.unit
      },
      set(unit) {
        if (!isEmpty(unit)) {
          this.pantry.unit = unit
          this.handleChange()
        }
      }
    }
  },
  created() {
    this.clearError()
  },
  methods: {
    ...mapMutations({
      setError: SET_ERROR,
      clearError: CLEAR_ERROR
    }),
    handleChange() {
      const { pantry } = this
      const { ingredient, quantity } = pantry

      let valid = true

      if (isEmpty(ingredient.trim()) || ingredient.length > 20) {
        valid = false
        this.setError({
          code: 'INGREDIENT_VALIDATION',
          message: 'Ingredient missing or way too long'
        })
      }

      if (quantity < 0) {
        if (isEmpty(quantity)) return
        valid = false
        this.setError({
          code: 'QUANTITY_VALIDATION',
          message: 'Quantity needs to be a number larger than 0'
        })
      }

      if (valid) this.$store.dispatch(WRITE_PANTRY, pantry)
    },
    removeItem() {
      // handle removing empty item
      if (isEmpty(this.cupboard.ingredient.trim())) {
        const index = this.cupboards.length - 1

        this.$store.commit(REMOVE_CUPBOARD, { index })
      } else {
        this.$store.dispatch(DELETE_CUPBOARD, this.cupboard)
      }
    }
  }
}
</script>

<style lang="scss">
.cupboard-list-item .v-text-field > .v-input__control > .v-input__slot:before {
  border-style: none;

  &:focus {
    border-style: solid;
  }
}

.cupboard-list-item .v-input {
  padding-top: 6px;
}

.cupboard-list-item .v-text-field__details {
  display: none;
}
</style>
