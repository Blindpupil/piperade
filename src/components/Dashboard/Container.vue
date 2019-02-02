<template>
  <v-app id="inspire" dark>
    <v-navigation-drawer clipped fixed v-model="drawer" app>
      <v-list dense>
        <v-list-tile>
          <v-list-tile-action>
            <v-icon>dashboard</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>Dashboard</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
        <v-list-tile>
          <v-list-tile-action>
            <v-icon>settings</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>Settings</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
      </v-list>
    </v-navigation-drawer>
    <v-toolbar app fixed clipped-left>
      <v-toolbar-side-icon @click.stop="drawer = !drawer"></v-toolbar-side-icon>
      <v-toolbar-title>Piperade.</v-toolbar-title>
    </v-toolbar>

    <v-content>
      <v-container fluid fill-height>
        <v-layout justify-center align-center>
          <v-flex shrink>
            Welcome to Piperade.
            The smart keeper for your recipes and groceries.
            <AddRecipeDialogs>
              <v-btn class="primary">Add recipe</v-btn>
            </AddRecipeDialogs>
          </v-flex>
        </v-layout>
      </v-container>
    </v-content>

    <v-footer app fixed>
      <span>&copy; 2019</span>
    </v-footer>
  </v-app>
</template>

<script>
import AddRecipeDialogs from '@/components/organisms/AddRecipeDialogs.vue'
import { GET_CUPBOARDS } from '@/store/types/action_types'

export default {
  components: {
    AddRecipeDialogs
  },
  created() {
    this.$store.dispatch(GET_CUPBOARDS)
  },
  data: () => ({
    drawer: true
  })
}
</script>
