<template>
  <v-dialog
    v-model="editRecipeDialog"
    transition="dialog-bottom-transition"
    hide-overlay
    fullscreen
    scrollable
  >
    <slot slot="activator"></slot>

    <v-card tile light>
      <v-toolbar card>
        <v-btn icon @click="close">
          <v-icon>arrow_back</v-icon>
        </v-btn>
        <v-toolbar-title>Editing {{ recipe.name }}</v-toolbar-title>
      </v-toolbar>

      <v-card-text class="py-1">
        <v-layout>
          <v-text-field label="Name" v-model="name" :placeholder="recipe.name"></v-text-field>
        </v-layout>

        <v-subheader class="pa-0">
          Ingredients

          <v-spacer></v-spacer>

          <WriteIngredientDialog>
            <v-btn color="primary" fab small>
              <v-icon>add</v-icon>
            </v-btn>
          </WriteIngredientDialog>
        </v-subheader>

        <RecipeIngredientsList />

        <v-text-field
          v-model="portions"
          :rules="portionsRules"
          name="Portions"
          label="portions"
          :placeholder="recipe.portions"
          hint="How many people it feeds in one sitting"
        ></v-text-field>

        <v-flex align-self-start class="w100">
          <v-subheader class="pa-0">
            Duration
          </v-subheader>

          <v-layout>
            <v-text-field
              v-model="duration.hours"
              :rules="durationRules"
              label="hours"
              name="Hours"
              class="px-1"
            ></v-text-field>
            <v-text-field
              v-model="duration.minutes"
              :rules="durationRules"
              label="minutes"
              name="Minutes"
            ></v-text-field>
          </v-layout>
        </v-flex>

        <v-textarea
          v-model="instructions"
          :placeholder="recipe.instructions"
          label="Instructions"
          hint="Instructions you know, in case you need them"
          persistent-hint
        ></v-textarea>

        <v-subheader class="pa-0 mt-2">
          Picture
        </v-subheader>
        <v-text-field
          label="Pics or it didn't happen"
          :placeholder="recipe.photo"
          v-model="photo"
        ></v-text-field>

        <v-subheader class="pa-0 mt-4 mb-1">
          Categories
        </v-subheader>
        <CategoriesBox />
      </v-card-text>

      <v-spacer></v-spacer>
      <v-divider></v-divider>

      <v-card-actions class="min-flex">
        <v-btn color="error" @click="deleteRecipe"> Delete </v-btn>
        <v-spacer></v-spacer>
        <v-btn color="primary" @click="save"> Save </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { mapGetters } from 'vuex'

import { RESET_RECIPE } from '@/store/types/mutation_types'
import { DELETE_RECIPE, WRITE_RECIPE } from '@/store/types/action_types'

import CategoriesBox from '@/components/atoms/CategoriesBox.vue'
import RecipeIngredientsList from '@/components/molecules/RecipeIngredientsList.vue'
import WriteIngredientDialog from '@/components/molecules/WriteIngredientDialog.vue'


export default {
  components: {
    CategoriesBox,
    RecipeIngredientsList,
    WriteIngredientDialog
  },
  props: {
    recipe: Object
  },
  data() {
    return {
      durationRules: [
        v => v >= 0 || 'Duration must be a real number'
      ],
      instructions: this.recipe.instructions,
      duration: {
        hours: this.recipe.duration.hours,
        minutes: this.recipe.duration.minutes
      },
      editRecipeDialog: false,
      name: this.recipe.name,
      portions: this.recipe.portions,
      photo: this.recipe.photo,
      portionsRules: [
        v => v > 0 || 'Portions must be a number greater than 0'
      ]
    }
  },
  computed: {
    ...mapGetters(['unitsList'])
  },
  methods: {
    close() {
      this.$store.commit(RESET_RECIPE)
      this.editRecipeDialog = false
    },
    deleteRecipe() {
      this.$store.dispatch(DELETE_RECIPE, this.recipe)

      this.editRecipeDialog = false
    },
    save() {
      const recipe = {
        ...this.recipe,
        duration: this.duration,
        name: this.name,
        portions: this.portions,
        instructions: this.instructions,
        photo: this.photo
      }

      this.$store.dispatch(WRITE_RECIPE, recipe)

      this.close()
    }
  }
}
</script>
