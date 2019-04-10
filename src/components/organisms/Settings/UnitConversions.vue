<template>
  <v-dialog
    v-model="unitConversionsDialog"
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
                Unit conversions
              </v-subheader>
              <p class="caption text-brand-gray">
                Here you can see and edit the conversion units used to calculate quantities.
              </p>

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
export default {
  data() {
    return {
      unitConversionsDialog: false
    }
  },
  methods: {
    close() {
      this.unitConversionsDialog = false
    },
    save() {
    }
  }
}
</script>
