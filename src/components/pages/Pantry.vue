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

      <v-fab-transition>
        <v-btn
          v-show="!hidden"
          @click="newCupboard"
          color="primary"
          class="bottom-float"
          fab fixed bottom right
        >
          <v-icon>add</v-icon>
        </v-btn>
      </v-fab-transition>
    </v-flex>
  </v-layout>
</template>

<script>
import { SET_CUPBOARDS } from '@/store/types/mutation_types'

import CupboardsList from '@/components/organisms/Pantry/CupboardsList.vue'


export default {
  components: {
    CupboardsList
  },
  data() {
    return {
      hidden: true
    }
  },
  created() {
    setTimeout(() => { this.hidden = false }, 100)
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

</style>
