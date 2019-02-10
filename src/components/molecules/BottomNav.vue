<template>
  <v-bottom-nav
    :active.sync="bottomNav"
    :color="color"
    :value="true"
    absolute
    dark
    shift
  >
    <v-btn dark @click="routes('/dashboard/')">
      <span>Recipes</span>
      <v-icon>room_service</v-icon>
    </v-btn>

    <v-btn dark @click="routes('/dashboard/pantry')">
      <span>Pantry</span>
      <v-icon>kitchen</v-icon>
    </v-btn>

    <v-btn dark @click="routes('/dashboard/lists')">
      <span>Lists</span>
      <v-icon>view_list</v-icon>
    </v-btn>

    <v-btn dark @click="routes('/dashboard/calendar')">
      <span>Calendar</span>
      <v-icon>calendar_today</v-icon>
    </v-btn>
  </v-bottom-nav>
</template>

<script>
export default {
  data: () => ({}),
  computed: {
    bottomNav: {
      get() {
        const path = window.location.pathname
        const location = path.substr(path.lastIndexOf('/') + 1)

        switch (location) {
          case '': return 0
          case 'pantry': return 1
          case 'lists': return 2
          case 'calendar': return 3

          default: return 0
        }
      },
      set() {
        return this.bottomNav
      }
    },
    color() {
      switch (this.bottomNav) {
        case 0: return 'blue-grey'
        case 1: return 'teal'
        case 2: return 'brown'
        case 3: return 'indigo'

        default: return 'black'
      }
    }
  },
  methods: {
    routes(link) {
      this.$router.push(link)
    }
  }
}
</script>
