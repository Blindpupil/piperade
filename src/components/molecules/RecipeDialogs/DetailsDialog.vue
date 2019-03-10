<template>
  <v-dialog
    v-model="detailsDialog"
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
        <v-toolbar-title>Details for {{ recipe.name }}</v-toolbar-title>
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
              <CategoriesBox :categories="recipe.categories" />

              <v-subheader class="pa-0 mt-2">
                Picture link
              </v-subheader>
              <v-text-field
                label="Pics or it didn't happen?"
                :placeholder="`https://myfoodpic.xyz/${recipe.name}.jpg`"
                v-model="photo"
              ></v-text-field>
            </v-flex>
          </v-layout>
        </v-container>
      </v-card-text>

      <v-spacer></v-spacer>
      <v-divider></v-divider>

      <v-card-actions class="min-flex">
        <v-btn flat @click="close">Cancel</v-btn>
        <v-spacer></v-spacer>
        <v-btn color="primary" @click="save">Save</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { mapGetters } from 'vuex'

import CategoriesBox from '@/components/molecules/CategoriesBox.vue'
import { WRITE_RECIPE } from '@/store/types/action_types'


export default {
  props: {
    detailsDialog: Boolean
  },
  components: {
    CategoriesBox
  },
  computed: {
    ...mapGetters(['recipe'])
  },
  data() {
    return {
      instructions: '',
      photo: ''
    }
  },
  methods: {
    back() {
      this.$emit('back:detailsdialog')
    },
    close() {
      this.$emit('cancel:addrecipedialogs')
    },
    save() {
      const recipe = {
        ...this.recipe,
        instructions: this.instructions,
        photo: this.photo
      }

      this.$store.dispatch(WRITE_RECIPE, recipe)
      this.close()
    }
  }
}
</script>
