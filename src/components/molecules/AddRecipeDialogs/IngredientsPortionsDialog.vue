<template>
  <v-dialog
    v-model="ingredientsDialog"
    fullscreen
    hide-overlay
    transition="dialog-bottom-transition"
    scrollable
  >
    <v-card tile>
      <v-toolbar card>
        <v-btn icon @click="back">
          <v-icon>arrow_back</v-icon>
        </v-btn>
        <v-toolbar-title>Ingredients for {{ recipe.name }}</v-toolbar-title>
      </v-toolbar>

      <v-card-text>
        <v-container class="pa-0">
          <v-layout column align-center>
            <v-flex align-self-start class="w100">
              <v-subheader class="pa-0">
                Base ingredients
                <v-spacer></v-spacer>

                <WriteIngredientDialog>
                  <v-btn color="primary" fab small>
                    <v-icon>add</v-icon>
                  </v-btn>
                </WriteIngredientDialog>
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
                  label="mins"
                  name="Minutes"
                ></v-text-field>
              </v-layout>
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
        <v-btn flat @click="close">Cancel</v-btn>
        <v-spacer></v-spacer>
        <v-btn color="primary" @click="continueToDetails">Next</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { isEmpty } from 'lodash-es'
import { mapGetters } from 'vuex'

import IngredientsList from '@/components/molecules/IngredientsList.vue'
import WriteIngredientDialog from '@/components/organisms/WriteIngredientDialog.vue'

import { SET_RECIPE } from '@/store/types/mutation_types'

export default {
  props: {
    ingredientsDialog: Boolean
  },
  components: {
    IngredientsList,
    WriteIngredientDialog
  },
  computed: {
    ...mapGetters(['recipe', 'isLoading'])
  },
  data() {
    return {
      alert: false,
      addedCupboard: false,
      duration: {},
      durationRules: [
        v => v >= 0 || 'Duration must be a real number'
      ],
      portions: '',
      portionsRules: [
        v => v > 0 || 'Portions must be a number greater than 0'
      ]
    }
  },
  methods: {
    back() {
      this.$emit('back:ingredientsdialog')
    },
    close() {
      this.$emit('cancel:addrecipedialogs')
    },
    continueToDetails() {
      if (!isEmpty(this.recipe.ingredients)) {
        this.save()
        this.$emit('show:detailsdialog')
      } else {
        this.alert = true
        setTimeout(() => { this.alert = false }, 3500)
      }
    },
    toggleAlert() {
      this.addedCupboard = true
      setTimeout(() => { this.addedCupboard = false }, 4000)
    },
    save() {
      const recipe = {
        ...this.recipe,
        portions: this.portions,
        duration: this.duration
      }

      this.$store.commit(SET_RECIPE, recipe)
    }
  }
}
</script>
