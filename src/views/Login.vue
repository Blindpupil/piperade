<template>
  <v-app>
    <v-container>
      <div class="display-1 text-center pa-2">
        Welcome!
      </div>

      <p class="text-center">Please authenticate to access your dashboard</p>

      <v-layout justify-center="">
        <v-btn color="red" class="white--text" @click="googleAuth">
          <v-icon dark left>public</v-icon>
          Continue with Google
        </v-btn>
      </v-layout>
    </v-container>
  </v-app>
</template>

<script>
import { GOOGLE_AUTH } from '@/store/types/action_types'

export default {
  methods: {
    googleAuth() {
      this.$store.dispatch(GOOGLE_AUTH)
    }
  }
}
</script>
