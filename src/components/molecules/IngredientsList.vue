<template>
  <div>
    <p v-if="ingredients.length === 0" class="ma-4">
      You haven't added any ingredients yet...
    </p>
    <v-layout row :key="index" align-center v-for="(ingredient, index) in ingredients">
      <v-flex xs1>
        <EditIngredientDialog>
          <v-icon @click="editIngredient(ingredient, index)">
            edit
          </v-icon>
        </EditIngredientDialog>
      </v-flex>

      <v-flex xs11>
        <v-list two-line class="py-0">
          <v-list-tile
            :key="ingredient.ingredient"
            avatar
            ripple
            @click="toggle(index)"
          >
            <v-list-tile-content>
              <v-list-tile-title>{{ ingredient.ingredient }}</v-list-tile-title>
            </v-list-tile-content>

            <v-list-tile-action>
              <v-list-tile-action-text>
                {{ ingredient.quantity }} {{ ingredient.unit }}
              </v-list-tile-action-text>
              <v-icon v-if="selected.indexOf(index) < 0" color="grey lighten-1">
                radio_button_unchecked
              </v-icon>

              <v-icon v-else color="green lighten-3">
                check_circle
              </v-icon>
            </v-list-tile-action>
          </v-list-tile>
        </v-list>
      </v-flex>

      <v-divider v-if="index + 1 < ingredients.length" :key="index"></v-divider>
    </v-layout>
  </div>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex'
import EditIngredientDialog from '@/components/organisms/EditIngredientDialog.vue'
import { SET_INGREDIENT_EDIT } from '@/store/types/mutation_types'
import {
  DELETE_CUPBOARD,
  WRITE_CUPBOARDS
} from '@/store/types/action_types'

export default {
  components: {
    EditIngredientDialog
  },
  computed: {
    ...mapGetters(['ingredients'])
  },
  data() {
    return {
      selected: [],
      pantry: []
    }
  },
  methods: {
    ...mapMutations({
      setIngredientForEdit: SET_INGREDIENT_EDIT
    }),
    editIngredient(ingredient, index) {
      this.setIngredientForEdit({ ...ingredient, index })
    },
    toggle(index) {
      const i = this.selected.indexOf(index)

      if (i > -1) {
        this.selected.splice(i, 1)

        this.$store.dispatch(DELETE_CUPBOARD, this.ingredients[index])
      } else {
        this.$emit('added:cupboard')
        this.selected.push(index)

        this.$store.dispatch(WRITE_CUPBOARDS, {
          cupboardItems: this.ingredients[index],
          isNew: false
        })
      }
    }
  }
}
</script>
