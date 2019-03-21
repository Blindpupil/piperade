<template>
  <Container />
</template>

<script>
import { isEmpty } from 'lodash-es'
import { mapState } from 'vuex'

import { GET_RECIPES, GET_CUPBOARDS, GET_LISTS } from '@/store/types/action_types'
import Container from '@/components/templates/Container.vue'

export default {
  name: 'Dashboard',
  components: {
    Container
  },
  computed: {
    ...mapState({
      recipes: state => state.recipe.recipes,
      lists: state => state.list.lists,
      cupboards: state => state.pantry.cupboards
    })
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
