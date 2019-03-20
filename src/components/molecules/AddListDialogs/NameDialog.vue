<template>
  <v-dialog
    v-model="nameDialog"
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
                  hint="Of the list, not yours"
                  v-model="name"
                  :placeholder="list.name || ''"
                  :rules="nameRules"
                  persistent-hint required
                ></v-text-field>
              </v-form>
            </v-flex>
          </v-layout>
        </v-container>
      </v-card-text>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn
          @click="validateName"
          :disabled="!validName"
          slot="activator"
          color="primary"
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

import { SET_LIST } from '@/store/types/mutation_types'


export default {
  props: {
    nameDialog: Boolean
  },
  data() {
    return {
      name: '',
      nameRules: [
        v => !isEmpty(v.trim()) || 'You must call this list something',
        v => v.length <= 30 || 'Name must be less than 30 characters'
      ],
      validName: false
    }
  },
  computed: {
    ...mapGetters(['list'])
  },
  methods: {
    save() {
      this.showNextDialog()

      const list = {
        ...this.list,
        name: this.name
      }
      this.$store.commit(SET_LIST, list)
    },
    showNextDialog() {
      this.$emit('saved:listname')
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
