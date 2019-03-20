<template>
  <v-layout row>
    <div @click="detailsDialog = true" class="w100 clickable">
      <slot></slot>
    </div>

    <DetailsDialog
      :detailsDialog="detailsDialog"
      @back:listdetailsdialog="back"
      @open:listnamedialog="editName"
      @cancel:addlistdialogs="cancel"
      editable
    />

    <NameDialog
      :nameDialog="nameDialog"
      @saved:listname="closeName"
    />
  </v-layout>
</template>

<script>
import DetailsDialog from '@/components/molecules/AddListDialogs/DetailsDialog.vue'
import NameDialog from '@/components/molecules/AddListDialogs/NameDialog.vue'

import { RESET_LIST } from '@/store/types/mutation_types'


export default {
  components: {
    DetailsDialog,
    NameDialog
  },
  data() {
    return {
      nameDialog: false,
      detailsDialog: false
    }
  },
  methods: {
    back() {
      this.detailsDialog = false
    },
    cancel() {
      this.nameDialog = false
      this.detailsDialog = false

      this.$store.commit(RESET_LIST)
    },
    closeName() {
      this.nameDialog = false
    },
    editName() {
      this.nameDialog = true
    }
  }
}
</script>
