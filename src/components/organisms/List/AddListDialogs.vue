<template>
  <v-layout row justify-center>
    <div @click="nameDialog = true">
      <slot></slot>
    </div>

    <NameDialog
      :nameDialog="nameDialog"
      @saved:listname="showListDetailsDialog"
    />

    <DetailsDialog
      :detailsDialog="detailsDialog"
      @back:listdetailsdialog="backToName"
      @cancel:addlistdialogs="cancel"
    />
  </v-layout>
</template>

<script>
import NameDialog from '@/components/molecules/AddListDialogs/NameDialog.vue'
import DetailsDialog from '@/components/molecules/AddListDialogs/DetailsDialog.vue'

import { RESET_LIST } from '@/store/types/mutation_types'


export default {
  components: {
    NameDialog,
    DetailsDialog
  },
  data() {
    return {
      nameDialog: false,
      detailsDialog: false
    }
  },
  methods: {
    cancel() {
      this.nameDialog = false
      this.detailsDialog = false

      this.$store.commit(RESET_LIST)
    },
    showListDetailsDialog() {
      this.detailsDialog = true
    },
    backToName() {
      this.detailsDialog = false
    }
  }
}
</script>
