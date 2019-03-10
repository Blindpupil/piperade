<template>
  <v-layout column align-center style="padding-bottom: 36px">
    <div>
      <h2>My Cupboard</h2>
      <p class="caption text-brand-gray">
        By adding items here we can tell you what's missing in your recipes and shopping lists.
      </p>
    </div>

    <v-flex>
      <CupboardsList />
    </v-flex>
  </v-layout>
</template>

<script>
import { isEmpty } from 'lodash-es'
import { mapGetters } from 'vuex'

import { GET_CUPBOARDS } from '@/store/types/action_types'

import CupboardsList from '@/components/molecules/CupboardsList.vue'


export default {
  components: {
    CupboardsList
  },
  created() {
    if (isEmpty(this.cupboards)) {
      this.$store.dispatch(GET_CUPBOARDS)
    }
  },
  computed: {
    ...mapGetters(['cupboards'])
  }
}
</script>

<style lang="scss">

</style>
