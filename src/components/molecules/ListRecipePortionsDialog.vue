<template>
  <v-dialog
    v-model="listRecipePortionsDialog"
    transition="dialog-bottom-transition"
    persistent
  >
    <v-btn
      slot="activator"
      v-show="recipe.listPortions"
      class="very-small-btn min-flex ma-0"
      flat icon
    >
      <v-icon class="small-icon">edit</v-icon>
    </v-btn>

    <v-card tile>
      <v-toolbar card>
        <v-btn icon @click="closeDialog">
          <v-icon>arrow_back</v-icon>
        </v-btn>
        <v-toolbar-title>
          Set portions
        </v-toolbar-title>
      </v-toolbar>

      <v-card-text>
        <v-container grid-list-sm>
          <v-layout wrap>
            <v-flex v-for="i in 6" :key="`2${i}`" @click="handleChange(i)" class="clickable" xs2>
              <v-card flat :color="i == portions ? 'primary lighten-1' : 'grey lighten-4'">
                <v-card-text
                  :class="i == portions ? 'text-white' : 'text-brand-gray'"
                  class="text-center"
                  v-text="i"
                ></v-card-text>
              </v-card>
            </v-flex>
            <v-flex xs12 mb-3>
              <v-form ref="writePortionsForm" v-model="validPortions">
                <v-text-field
                  v-model="newPortion"
                  :rules="quantityRules"
                  label="How many?"
                  hint="Even more portions? Must be a party"
                ></v-text-field>
              </v-form>
            </v-flex>
          </v-layout>
        </v-container>
      </v-card-text>

      <v-card-actions class="justify-end" style="padding: 16px 32px">
        <v-btn color="primary" @click="validatePortions"> Save </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { PARSE_LIST_PORTIONS } from '@/store/types/action_types'


export default {
  props: {
    list: Object,
    recipe: Object
  },
  data() {
    return {
      listRecipePortionsDialog: false,
      validPortions: false,
      newPortion: '',
      quantityRules: [
        v => (v > 0 || v === '') || 'Gotta be a number bigger than 0'
      ]
    }
  },
  computed: {
    portions: {
      get() {
        return this.recipe.listPortions
      },
      set(listPortions) {
        const { list, recipe } = this

        this.$store.dispatch(PARSE_LIST_PORTIONS, { list, recipe, listPortions })
      }
    }
  },
  methods: {
    closeDialog() {
      this.listRecipePortionsDialog = false
    },
    handleChange(value) {
      this.portions = value
      this.newPortion = value
    },
    validatePortions() {
      const {
        list,
        recipe,
        portions,
        newPortion
      } = this

      const listPortions = Number(newPortion)
      const portionsNeedUpdate = listPortions !== Number(portions)

      const isValid = this.$refs.writePortionsForm.validate()

      if (isValid && portionsNeedUpdate) {
        this.$store.dispatch(PARSE_LIST_PORTIONS, { list, recipe, listPortions })

        this.closeDialog()
        this.newPortion = ''
      } else if (!portionsNeedUpdate) {
        this.closeDialog()
        this.newPortion = ''
      }
    }
  }
}
</script>
