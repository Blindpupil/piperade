<template>
  <v-bottom-nav
    :active.sync="bottomNav"
    :color="color"
    :value="true"
    fixed
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
  data() {
    return {
      bottomNav: ''
    }
  },
  created() {
    const { pathname } = window.location
    const location = pathname.substr(pathname.lastIndexOf('/') + 1)

    switch (location) {
      case '': this.bottomNav = 0
        break
      case 'pantry': this.bottomNav = 1
        break
      case 'lists': this.bottomNav = 2
        break
      case 'calendar': this.bottomNav = 3
        break

      default: this.bottomNav = 0
    }
  },
  computed: {
    color() {
      switch (this.bottomNav) {
        case 0: return 'blue-grey'
        case 1: return 'teal'
        case 2: return 'brown'
        case 3: return 'indigo'
        default: return 'blue-grey'
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
