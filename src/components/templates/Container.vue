<template>
  <v-app>
    <v-navigation-drawer
      v-model="drawer"
      clipped fixed
      app
    >
      <v-toolbar flat class="transparent">
        <v-list class="pa-0">
          <v-list-tile avatar>
            <v-list-tile-avatar>
              <img :src="userDetails.picture">
            </v-list-tile-avatar>

            <v-list-tile-content>
              <v-list-tile-title v-text="userDetails.name"></v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>
        </v-list>
      </v-toolbar>

      <v-list>
        <v-list-group
          prepend-icon="settings"
          value="true"
        >
          <div slot="activator">
            <v-list-tile>
              <v-list-tile-title>Settings</v-list-tile-title>
            </v-list-tile>
          </div>

          <IngredientsSuggestions class="w100">
            <v-list-tile @click="{}">
              <v-list-tile-action>
                <v-icon>subject</v-icon>
              </v-list-tile-action>
              <v-list-tile-title>Ingredients suggestions</v-list-tile-title>
            </v-list-tile>
          </IngredientsSuggestions>
          <UnitConversions class="w100">
            <v-list-tile @click="{}">
              <v-list-tile-action>
                <v-icon>settings_ethernet</v-icon>
              </v-list-tile-action>
              <v-list-tile-title>Unit conversions</v-list-tile-title>
            </v-list-tile>
          </UnitConversions>
        </v-list-group>

        <v-list-tile @click="logout">
          <v-list-tile-action>
            <v-icon>power_settings_new</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>Logout</v-list-tile-title>
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
import { mapState } from 'vuex'
import { GET_USER_DETAILS, LOGOUT } from '@/store/types/action_types'
import BottomNav from '@/components/atoms/BottomNav.vue'
import IngredientsSuggestions from '@/components/organisms/Settings/IngredientsSuggestions.vue'
import UnitConversions from '@/components/organisms/Settings/UnitConversions.vue'

export default {
  components: {
    BottomNav,
    IngredientsSuggestions,
    UnitConversions
  },
  data: () => ({
    drawer: true
  }),
  computed: {
    ...mapState({
      userDetails: state => state.user.userDetails
    })
  },
  created() {
    this.$store.dispatch(GET_USER_DETAILS)
  },
  methods: {
    logout() {
      this.$store.dispatch(LOGOUT)
        .then(() => this.$router.push('/login'))
    }
  }
}
</script>
