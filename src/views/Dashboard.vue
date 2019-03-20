<template>
  <Container />
</template>

<script>
import { isEmpty } from 'lodash-es'
import { mapGetters } from 'vuex'

import { GET_RECIPES, GET_CUPBOARDS, GET_LISTS } from '@/store/types/action_types'
import Container from '@/components/templates/Container.vue'

export default {
  name: 'Dashboard',
  components: {
    Container
  },
  computed: {
    ...mapGetters(['recipes', 'cupboards', 'lists'])
  },
  created() {
    if (isEmpty(this.recipes)) {
      this.$store.dispatch(GET_RECIPES)
    }
    if (isEmpty(this.cupboards)) {
      this.$store.dispatch(GET_CUPBOARDS)
    }
    if (isEmpty(this.lists)) {
      this.$store.dispatch(GET_LISTS)
    }
  }
}
</script>
