<template>
  <v-dialog
    v-model="settingsDialog"
    transition="slide-x-transition"
    fullscreen
    hide-overlay
    scrollable
  >
    <slot slot="activator"></slot>

    <v-card tile>
      <v-toolbar card>
        <v-toolbar-title>Settings</v-toolbar-title>
      </v-toolbar>

      <v-card-text>
        <v-container class="pa-0">
          <v-layout column align-center>
            <v-flex align-self-start class="w100">
              <v-subheader class="pa-0">
                Ingredients suggestions
              </v-subheader>
              <p class="caption text-brand-gray">
                These are the ingredients that are suggested for you.
                We take these from recipes you add.
                Here you can edit or remove them.
              </p>

              <v-layout row wrap>
                <SettingsIngredientItem
                  v-for="(ingredient, index) in ingredientsList"
                  :index="index"
                  :key="index"
                />
              </v-layout>

            </v-flex>
          </v-layout>
        </v-container>
      </v-card-text>

      <v-spacer></v-spacer>
      <v-divider></v-divider>

      <v-card-actions class="min-flex">
        <v-btn flat @click="close">Close</v-btn>
        <v-spacer></v-spacer>
        <v-btn color="primary" @click="save">Save</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { mapState } from 'vuex'

import { WRITE_INGREDIENTS } from '@/store/types/action_types'
import SettingsIngredientItem from '@/components/atoms/SettingsIngredientItem.vue'

export default {
  components: {
    SettingsIngredientItem
  },
  data() {
    return {
      settingsDialog: false
    }
  },
  computed: {
    ...mapState({
      ingredientsList: state => state.ingredient.ingredientsList
    })
  },
  methods: {
    close() {
      this.settingsDialog = false
    },
    save() {
      this.$store.dispatch(WRITE_INGREDIENTS, this.ingredientsList)
      this.close()
    }
  }
}
</script>
