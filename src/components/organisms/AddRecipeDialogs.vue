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

    <!-- RECIPE INGREDIENTS AND PANTRY DIALOG -->
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

                <p v-if="ingredients.length === 0" class="ma-4">
                  You haven't added any ingredients yet...
                </p>

                <!-- Ingredients list view -->
                <template v-for="(ingredient, index) in ingredients">
                  <v-layout row :key="index" align-center>
                    <v-flex xs1>
                      <EditIngredientDialog>
                        <v-icon @click="editIngredient(ingredient, index)">
                          edit
                        </v-icon>
                      </EditIngredientDialog>
                    </v-flex>

                    <v-flex xs11>
                      <v-list two-line>
                        <v-list-tile
                          :key="ingredient.ingredient"
                          avatar
                          ripple
                          @click="toggle(index)"
                        >
                          <v-list-tile-content>
                            <v-list-tile-title>{{ ingredient.ingredient }}</v-list-tile-title>
                            <v-list-tile-sub-title v-if="ingredient.substitute">
                              Or {{ ingredient.substitute }}
                            </v-list-tile-sub-title>
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
                </template>
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
          v-model="haveItmsg"
          transition="slide-y-reverse-transition"
          dismissible
          type="success"
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
import AddIngredientDialog from '@/components/organisms/AddIngredientDialog.vue'
import EditIngredientDialog from '@/components/organisms/EditIngredientDialog.vue'
import { WRITE_CUPBOARDS, WRITE_RECIPE } from '@/store/types/action_types'
import { SET_INGREDIENT_EDIT, SET_RECIPE_NAME } from '@/store/types/mutation_types'

export default {
  components: {
    AddIngredientDialog,
    EditIngredientDialog,
    CategoriesBox
  },
  computed: {
    ...mapGetters(['ingredients', 'recipeName', 'categories'])
  },
  created() {
    if (!isEmpty(this.recipeName)) this.name = this.recipeName
  },
  data() {
    return {
      alert: false,
      haveItmsg: false,
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
      selected: [],
      detailsDialog: false,
      instructions: '',
      pantry: [],
      photo: ''
    }
  },
  methods: {
    ...mapMutations({
      setName: SET_RECIPE_NAME,
      setIngredientEdit: SET_INGREDIENT_EDIT
    }),
    validateName() {
      if (this.$refs.nameForm.validate()) {
        if (typeof this.name === 'string') this.setName(this.name)
        this.snackbar = true
        this.recipeDialog = true
      }
    },
    editIngredient(ingredient, index) {
      this.setIngredientEdit({ ...ingredient, index })
    },
    goToPreviousDialog() {
      this.recipeDialog = !this.recipeDialog
    },
    toggle(index) {
      const i = this.selected.indexOf(index)

      if (i > -1) {
        this.selected.splice(i, 1)
      } else {
        this.selected.push(index)
        this.haveItmsg = true
        setTimeout(() => { this.haveItmsg = false }, 4000)
      }
    },
    continueToDetails() {
      if (!isEmpty(this.ingredients)) {
        this.detailsDialog = true
      } else {
        this.alert = true
        setTimeout(() => { this.alert = false }, 4000)
      }
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

      const cupboards = []

      this.selected.forEach((i) => {
        const ingredient = this.ingredients[i]
        delete ingredient.substitute
        cupboards.push(ingredient)
      })

      if (!isEmpty(cupboards)) this.$store.dispatch(WRITE_CUPBOARDS, cupboards)

      this.$store.dispatch(WRITE_RECIPE, recipe)
    }
  }
}
</script>
