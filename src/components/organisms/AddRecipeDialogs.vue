<template>
  <v-layout row justify-center>
    <div @click="nameDialog = true">
      <slot></slot>
    </div>

    <!-- NAME DIALOG -->
    <v-dialog
      v-model="nameDialog"
      fullscreen
      hide-overlay
      transition="dialog-bottom-transition"
    >
      <v-card>
        <v-card-text>
          <v-container grid-list-md>
            <v-layout wrap>
              <v-flex xs12 mb-3>
                <v-form ref="nameForm" v-model="validName">
                  <v-text-field
                    label="Name"
                    hint="Of the recipe, not yours"
                    v-model="name"
                    :rules="nameRules"
                    persistent-hint
                    required
                  ></v-text-field>
                </v-form>
              </v-flex>
            </v-layout>
          </v-container>
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn flat @click="nameDialog = false">Close</v-btn>
          <v-btn
            slot="activator"
            :disabled="!validName"
            color="primary"
            @click="validateName"
          >
            Continue
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- RECIPE INGREDIENTS AND PORTIONS DIALOG -->
    <v-dialog
      v-model="recipeDialog"
      fullscreen
      hide-overlay
      transition="dialog-bottom-transition"
      scrollable
    >
      <v-card tile>
        <v-toolbar card>
          <v-btn icon @click="recipeDialog = false">
            <v-icon>arrow_back</v-icon>
          </v-btn>
          <v-toolbar-title>Ingredients for {{ recipeName }}</v-toolbar-title>
        </v-toolbar>

        <v-card-text>
          <v-container class="pa-0">
            <v-layout column align-center>
              <v-flex align-self-start class="w100">
                <v-subheader class="pa-0">
                  Base ingredients
                  <v-spacer></v-spacer>

                  <AddIngredientDialog>
                    <v-btn color="primary" fab small>
                      <v-icon>add</v-icon>
                    </v-btn>
                  </AddIngredientDialog>
                </v-subheader>

                <!-- Ingredients list view -->
                <IngredientsList @added:cupboard="toggleAlert"> </IngredientsList>
              </v-flex>

              <v-flex align-self-start class="w100">
                <v-subheader class="pa-0">
                  Portions
                </v-subheader>
                <v-text-field
                  v-model="portions"
                  :rules="portionsRules"
                  name="Portions"
                  label="How many portions this recipe makes?"
                  hint="How many people it feeds in one sitting"
                ></v-text-field>
              </v-flex>
            </v-layout>
          </v-container>
        </v-card-text>

        <v-spacer></v-spacer>

        <v-alert
          v-model="alert"
          transition="scale-transition"
          dismissible
          type="error"
          outline
        >
          You need to add ingredients first
        </v-alert>

        <v-alert
          v-model="addedCupboard"
          transition="slide-y-reverse-transition"
          type="success"
          dismissible
          outline
        >
          We'll note that you already have this ingredient!
        </v-alert>

        <v-divider></v-divider>

        <v-card-actions class="min-flex">
          <v-btn flat @click="recipeDialog = false">Cancel</v-btn>
          <v-spacer></v-spacer>
          <v-btn color="primary" @click="continueToDetails">Next</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- RECIPE INSTRUCTIONS AND CATEGORIES -->
    <v-dialog
      v-model="detailsDialog"
      fullscreen
      hide-overlay
      transition="dialog-bottom-transition"
      scrollable
    >
      <v-card tile>
        <v-toolbar card>
          <v-btn icon @click="detailsDialog = false">
            <v-icon>arrow_back</v-icon>
          </v-btn>
          <v-toolbar-title>Details for {{ recipeName }}</v-toolbar-title>
        </v-toolbar>

        <v-card-text>
          <v-container class="pa-0">
            <v-layout column align-center>
              <v-flex align-self-start class="w100">
                <v-subheader class="pa-0">
                  Recipe instructions and notes
                </v-subheader>

                <v-textarea
                  label="Instructions"
                  hint="Instructions you know, in case you need them"
                  placeholder="Peel the skin off the tomatoes and place them facing down..."
                  v-model="instructions"
                  persistent-hint
                ></v-textarea>

                <v-subheader class="pa-0 mt-4 mb-1">
                  Categories
                </v-subheader>
                <CategoriesBox />

                <v-subheader class="pa-0 mt-2">
                  Picture link
                </v-subheader>
                <v-text-field
                  label="Pics or it didn't happen?"
                  :placeholder="`https://myfoodpic.xyz/${recipeName}.jpg`"
                  v-model="photo"
                ></v-text-field>
              </v-flex>
            </v-layout>
          </v-container>
        </v-card-text>

        <v-spacer></v-spacer>
        <v-divider></v-divider>

        <v-card-actions class="min-flex">
          <v-btn flat @click="detailsDialog = false">Cancel</v-btn>
          <v-spacer></v-spacer>
          <v-btn color="primary" @click="save">Save</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-layout>
</template>

<script>
import { isEmpty } from 'lodash-es'
import { mapGetters, mapMutations } from 'vuex'

import CategoriesBox from '@/components/molecules/CategoriesBox.vue'
import IngredientsList from '@/components/molecules/IngredientsList.vue'

import AddIngredientDialog from '@/components/organisms/AddIngredientDialog.vue'

import { WRITE_RECIPE } from '@/store/types/action_types'
import { SET_RECIPE_NAME } from '@/store/types/mutation_types'


export default {
  components: {
    AddIngredientDialog,
    CategoriesBox,
    IngredientsList
  },
  created() {
    if (!isEmpty(this.recipeName)) this.name = this.recipeName
  },
  computed: {
    ...mapGetters(['ingredients', 'recipeName', 'categories'])
  },
  data() {
    return {
      alert: false,
      addedCupboard: false,
      name: '',
      nameDialog: false,
      nameRules: [
        v => !isEmpty(v.trim()) || 'You must call this recipe something',
        v => v.length <= 50 || 'Name must be less than 50 characters'
      ],
      portions: '',
      portionsRules: [
        v => v > 0 || 'Portions must be a number greater than 0'
      ],
      validName: false,
      recipeDialog: false,
      detailsDialog: false,
      instructions: '',
      photo: ''
    }
  },
  methods: {
    ...mapMutations({
      setName: SET_RECIPE_NAME
    }),
    validateName() {
      if (this.$refs.nameForm.validate()) {
        if (typeof this.name === 'string') this.setName(this.name)
        this.snackbar = true
        this.recipeDialog = true
      }
    },
    goToPreviousDialog() {
      this.recipeDialog = !this.recipeDialog
    },
    continueToDetails() {
      if (!isEmpty(this.ingredients)) {
        this.detailsDialog = true
      } else {
        this.alert = true
        setTimeout(() => { this.alert = false }, 3500)
      }
    },
    toggleAlert() {
      this.addedCupboard = true
      setTimeout(() => { this.addedCupboard = false }, 4000)
    },
    close() {
      this.detailsDialog = false
      this.recipeDialog = false
      this.nameDialog = false
    },
    save() {
      const recipe = {
        name: this.name,
        ingredients: this.ingredients,
        portions: this.portions,
        instructions: this.instructions,
        categories: this.categories,
        photo: this.photo
      }

      this.$store.dispatch(WRITE_RECIPE, recipe)
      this.close()
    }
  }
}
</script>
