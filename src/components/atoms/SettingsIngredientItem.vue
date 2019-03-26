<template>
  <v-flex xs6>
    <v-card class="my-1 xs6" transition="slide-y-reverse-transition">
      <v-flex cupboard-list-item>
        <v-layout row my-2 px-2 pt-2 align-center>
          <v-flex>
            <v-text-field
              v-model="editable"
              name="ingredient"
              label="ingredient"
            ></v-text-field>
          </v-flex>
          <v-flex shrink>
            <v-icon @click="removeItem">
              remove_circle
            </v-icon>
          </v-flex>
        </v-layout>
      </v-flex>
    </v-card>
  </v-flex>
</template>

<script>
import { mapState } from 'vuex'

import { SET_USER_INGREDIENT, REMOVE_USER_INGREDIENT } from '@/store/types/mutation_types'

export default {
  props: {
    index: Number
  },
  data: () => ({}),
  computed: {
    ...mapState({
      ingredientsList: state => state.ingredient.ingredientsList
    }),
    editable: {
      get() {
        return this.ingredientsList[this.index]
      },
      set(value) {
        this.$store.commit(SET_USER_INGREDIENT, { ingredient: value, index: this.index })
      }
    }
  },
  methods: {
    removeItem() {
      this.$store.commit(REMOVE_USER_INGREDIENT, this.index)
    }
  }
}
</script>
