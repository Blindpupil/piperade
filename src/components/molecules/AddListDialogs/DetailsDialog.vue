<template>
  <v-dialog
    v-model="detailsDialog"
    transition="dialog-bottom-transition"
    fullscreen hide-overlay scrollable
  >
    <v-card tile>
      <v-toolbar card>
        <v-btn icon @click="back">
          <v-icon>arrow_back</v-icon>
        </v-btn>
        <v-toolbar-title class="flex">{{ list.name }}</v-toolbar-title>
        <v-btn v-show="editable" @click="editName" icon>
          <v-icon>edit</v-icon>
        </v-btn>
      </v-toolbar>

      <v-card-text>
        <v-container class="pa-0">
          <v-layout column align-center>
            <v-flex align-self-start class="w100">
              <v-subheader class="pa-0">
                Ingredients in recipes
                <v-spacer></v-spacer>

                <AddRecipesToListDialog :list="list">
                  <v-btn color="primary" fab small>
                    <v-icon>add</v-icon>
                  </v-btn>
                </AddRecipesToListDialog>
              </v-subheader>

              <!-- List items view -->
              <ListRecipes :listRecipes="list.recipes" />
            </v-flex>

            <v-flex align-self-start class="w100">
              <v-subheader class="pa-0">
                Stuff missing for recipes
              </v-subheader>

              <ListIngredientItems :ingredients="list.items" />

              <v-subheader class="pa-0">
                Other items you may need
                <v-spacer></v-spacer>

                <v-btn @click="addExtra" color="primary" fab small>
                  <v-icon>add</v-icon>
                </v-btn>
              </v-subheader>

              <div v-show="!list.extras" class="ma-4">
                Add anything extra here, not part of recipe ingredients.
              </div>

              <ExtraListItem
                @updated:item="update"
                v-for="(extra, index) in list.extras"
                :key="index"
                :extra="extra"/>

            </v-flex>
          </v-layout>
        </v-container>
      </v-card-text>

      <v-spacer></v-spacer>
      <v-divider></v-divider>

      <v-card-actions class="min-flex">
        <v-btn flat @click="close">Cancel</v-btn>
        <v-spacer></v-spacer>
        <v-btn color="primary" @click="save">Save</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { mapGetters } from 'vuex'
import { WRITE_LIST } from '@/store/types/action_types'
import { ADD_EXRA_LIST_ITEM } from '@/store/types/mutation_types'

import ExtraListItem from '@/components/atoms/ExtraListItem.vue'
import AddRecipesToListDialog from '@/components/molecules/AddListDialogs/AddRecipesToListDialog.vue'
import ListIngredientItems from '@/components/molecules/ListIngredientItems.vue'
import ListRecipes from '@/components/molecules/ListRecipes.vue'


export default {
  props: {
    editable: Boolean,
    detailsDialog: Boolean
  },
  components: {
    AddRecipesToListDialog,
    ExtraListItem,
    ListIngredientItems,
    ListRecipes
  },
  computed: {
    ...mapGetters(['list'])
  },
  methods: {
    addExtra() {
      const { list } = this
      const index = list.extras ? list.extras.length : 0
      this.$store.commit(ADD_EXRA_LIST_ITEM, { item: {}, index })
      this.$forceUpdate()
    },
    editName() {
      this.$emit('open:listnamedialog')
    },
    update() {
      this.$forceUpdate()
    },
    back() {
      this.$emit('back:listdetailsdialog')
    },
    close() {
      this.$emit('cancel:addlistdialogs')
    },
    save() {
      this.$store.dispatch(WRITE_LIST, this.list)
      this.close()
    }
  }
}
</script>
