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
          <v-text-field label="Name" v-model="newName" :placeholder="recipe.name"></v-text-field>
        </v-layout>

        <v-subheader class="pa-0">
          Ingredients

          <v-spacer></v-spacer>

          <AddIngredientDialog>
            <v-btn color="primary" fab small>
              <v-icon>add</v-icon>
            </v-btn>
          </AddIngredientDialog>
        </v-subheader>

        <IngredientsList> </IngredientsList>

        <v-text-field
          v-model="newPortions"
          :rules="portionsRules"
          name="Portions"
          label="Portions"
          hint="How many people it feeds in one sitting"
        ></v-text-field>

        <v-textarea
          v-model="newInstructions"
          label="Instructions"
          hint="Instructions you know, in case you need them"
          :placeholder="recipe.instructions"
          persistent-hint
        ></v-textarea>

        <v-subheader class="pa-0 mt-2">
          Picture
        </v-subheader>
        <v-text-field
          label="Pics or it didn't happen"
          :placeholder="recipe.photo"
          v-model="newPhoto"
        ></v-text-field>

        <v-subheader class="pa-0 mt-4 mb-1">
          Categories
        </v-subheader>
        <CategoriesBox :categories="recipe.categories || []"/>
      </v-card-text>

      <v-spacer></v-spacer>
      <v-divider></v-divider>

      <v-card-actions class="min-flex">
        <v-btn color="error" @click="remove"> Delete </v-btn>
        <v-spacer></v-spacer>
        <v-btn color="primary" @click="save"> Save </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { mapGetters } from 'vuex'
import { DELETE_RECIPE, WRITE_RECIPE } from '@/store/types/action_types'
import CategoriesBox from '@/components/molecules/CategoriesBox.vue'
import IngredientsList from '@/components/molecules/IngredientsList.vue'
import AddIngredientDialog from '@/components/organisms/AddIngredientDialog.vue'

export default {
  components: {
    CategoriesBox,
    IngredientsList,
    AddIngredientDialog
  },
  props: {
    recipe: Object
  },
  data() {
    return {
      newName: '',
      editRecipeDialog: false,
      portionsRules: [
        v => v > 0 || 'Portions must be a number greater than 0'
      ],
      newInstructions: '',
      newPortions: '',
      newPhoto: ''
    }
  },
  computed: {
    ...mapGetters(['unitsList', 'ingredients', 'categories'])
  },
  methods: {
    close() {
      this.editRecipeDialog = false
    },
    remove() {
      this.$store.dispatch(DELETE_RECIPE, this.recipe)

      this.editRecipeDialog = false
      this.$emit('close:dialog')
    },
    save() {
      const recipe = {
        name: this.newName || this.recipe.name,
        ingredients: this.ingredients,
        categories: this.categories,
        portions: this.newPortions || this.recipe.portions,
        instructions: this.newInstructions || this.recipe.instructions,
        photo: this.newPhoto || this.recipe.photo,
        id: this.recipe.id
      }

      this.$store.dispatch(WRITE_RECIPE, recipe)

      this.close()
    }
  }
}
</script>
