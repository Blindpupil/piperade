<template>
  <v-layout column>
    <p v-if="cupboards.length === 0" class="ma-4">
      You haven't added anything to your pantry yet...
    </p>

    <CupboardListItem
      v-for="(cupboard, index) in cupboards"
      :key="index"
      :cupboard="cupboard"
    ></CupboardListItem>

    <v-alert
      v-model="validationAlert"
      transition="scale-transition"
      dismissible
      type="error"
      outline
    >
      {{ message }}
    </v-alert>


    <v-fab-transition>
      <v-btn
        v-show="!hidden"
        @click="newCupboard"
        color="primary"
        class="add-cupboard"
        fab fixed bottom right
      >
        <v-icon>add</v-icon>
      </v-btn>
    </v-fab-transition>
  </v-layout>
</template>

<script>
import { isEmpty } from 'lodash-es'
import { mapGetters } from 'vuex'

import { SET_CUPBOARDS } from '@/store/types/mutation_types'

import CupboardListItem from '@/components/atoms/CupboardListItem.vue'


export default {
  components: {
    CupboardListItem
  },
  data() {
    return {
      hidden: true
    }
  },
  created() {
    setTimeout(() => { this.hidden = false }, 100)
  },
  computed: {
    ...mapGetters(['cupboards', 'message']),
    validationAlert() {
      return (!isEmpty(this.message))
    }
  },
  methods: {
    newCupboard() {
      this.$store.commit(SET_CUPBOARDS, {
        cupboardItems: {
          ingredient: '',
          quantity: '',
          unit: ''
        },
        isNew: true
      })
    }
  }
}
</script>

<style lang="scss">
.add-cupboard {
  bottom: 5rem !important;
}
</style>
