<template>
  <v-layout column>
    <p v-if="cupboards.length === 0" class="ma-4">
      You haven't added anything to your pantry yet...
    </p>

    <CupboardListItem
      v-for="(cupboard, index) in cupboards"
      :key="`${index}${cupboard.ingredient}`"
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
  </v-layout>
</template>

<script>
import { isEmpty } from 'lodash-es'
import { mapGetters, mapState } from 'vuex'

import { CLEAR_ERROR } from '@/store/types/mutation_types'

import CupboardListItem from '@/components/atoms/CupboardListItem.vue'


export default {
  components: {
    CupboardListItem
  },
  computed: {
    ...mapGetters(['message']),
    ...mapState({
      cupboards: state => state.pantry.cupboards
    }),
    validationAlert: {
      get() {
        return (!isEmpty(this.message))
      },
      set() {
        this.$store.commit(CLEAR_ERROR)
      }
    }
  }
}
</script>
