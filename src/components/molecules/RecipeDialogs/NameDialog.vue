<template>
  <v-dialog
    v-model="nameDialog"
    fullscreen
    hide-overlay
    transition="dialog-bottom-transition"
  >
    <v-card>
      <v-card-text>
        <v-container grid-list-md>
          <v-layout wrap>
            <v-flex xs12 mb-3>
              <v-form ref="nameForm" v-model="validName">
                <v-text-field
                  label="Name"
                  hint="Of the recipe, not yours"
                  v-model="name"
                  :placeholder="recipe.name || name"
                  :rules="nameRules"
                  persistent-hint
                  required
                ></v-text-field>
              </v-form>
            </v-flex>
          </v-layout>
        </v-container>
      </v-card-text>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn flat @click="close">Close</v-btn>
        <v-btn
          slot="activator"
          :disabled="!validName"
          color="primary"
          @click="validateName"
        >
          Continue
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { isEmpty } from 'lodash-es'
import { mapGetters } from 'vuex'
import { SET_RECIPE } from '@/store/types/mutation_types'


export default {
  props: {
    nameDialog: Boolean
  },
  computed: {
    ...mapGetters(['recipe'])
  },
  data() {
    return {
      name: '',
      nameRules: [
        v => !isEmpty(v.trim()) || 'You must call this recipe something',
        v => v.length <= 30 || 'Name must be less than 30 characters'
      ],
      validName: false
    }
  },
  methods: {
    save() {
      this.showNextDialog()
      const recipe = {
        ...this.recipe,
        name: this.name
      }
      this.$store.commit(SET_RECIPE, recipe)
    },
    close() {
      this.$emit('cancel:addrecipedialogs')
    },
    showNextDialog() {
      this.$emit('show:ingredientsdialog')
    },
    validateName() {
      if (this.$refs.nameForm.validate()) {
        if (typeof this.name === 'string') this.save()
        this.snackbar = true
      }
    }
  }
}
</script>
