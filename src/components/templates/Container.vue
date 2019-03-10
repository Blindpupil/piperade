<template>
  <v-app id="inspire">
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

    <v-content style="padding-bottom: 56px">
      <v-container fluid fill-height>
        <router-view></router-view>
      </v-container>
    </v-content>

    <BottomNav></BottomNav>
  </v-app>
</template>

<script>
import BottomNav from '@/components/atoms/BottomNav.vue'

export default {
  components: {
    BottomNav
  },
  data: () => ({
    drawer: true
  })
}
</script>
