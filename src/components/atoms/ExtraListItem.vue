<template>
  <v-slide-y-transition>
    <v-card flat my-1>
      <v-flex cupboard-list-item>
        <v-layout row my-1 align-center :success--text="extra.obtained">
          <v-flex @click="toggle" shrink pr-1>
            <v-btn v-if="extra.obtained" color="success" class="very-small-btn ma-1" fab>
              <v-icon dark>radio_button_checked</v-icon>
            </v-btn>
            <v-btn v-else fab class="very-small-btn ma-1">
              <v-icon dark>radio_button_unchecked</v-icon>
            </v-btn>
          </v-flex>
          <v-flex text-brand-gray grow pt-1>
            <v-text-field
              :class="{'success--text': extra.obtained}"
              name="name"
              v-model="name"
              label="name"
            ></v-text-field>
          </v-flex>
          <v-flex font-weight-bold px-2 shrink pt-1>
            <v-text-field
              v-model="quantity"
              name="quantity"
              label="quantity"
            ></v-text-field>
          </v-flex>
          <v-flex shrink pt-1>
            <v-icon @click="removeItem">
              remove_circle
            </v-icon>
          </v-flex>
        </v-layout>
      </v-flex>
    </v-card>
  </v-slide-y-transition>
</template>

<script>
import { isEmpty } from 'lodash-es'
import { mapGetters, mapMutations } from 'vuex'

import {
  ADD_EXRA_LIST_ITEM,
  REMOVE_EXTRA_LIST_ITEM,
  SET_ERROR
} from '@/store/types/mutation_types'


export default {
  props: {
    extra: Object
  },
  data() {
    return {
      data: false,
      item: {
        name: this.extra ? this.extra.name : '',
        quantity: this.extra ? this.extra.quantity : '',
        obtained: this.extra ? this.extra.obtained : false
      }
    }
  },
  computed: {
    ...mapGetters(['list']),
    name: {
      get() {
        return this.extra ? this.extra.name : ''
      },
      set(name) {
        this.item.name = name
        this.handleChange()
      }
    },
    quantity: {
      get() {
        return this.extra ? this.extra.quantity : ''
      },
      set(quantity) {
        this.item.quantity = quantity
        this.handleChange()
      }
    }
  },
  methods: {
    ...mapMutations({
      setError: SET_ERROR,
      addItem: ADD_EXRA_LIST_ITEM,
      remove: REMOVE_EXTRA_LIST_ITEM
    }),
    handleChange() {
      const { item } = this
      const { name, quantity } = item
      const index = this.$vnode.key

      let valid = true

      if (isEmpty(name.trim()) || name.length > 20) {
        valid = false
        this.setError({
          code: 'EXTRA_ITEM_VALIDATION',
          message: 'Item missing or way too long'
        })
      }

      if (quantity < 0) {
        if (isEmpty(quantity)) return
        valid = false
        this.setError({
          code: 'QUANTITY_VALIDATION',
          message: 'Quantity needs to be a number larger than 0'
        })
      }

      if (valid) {
        this.addItem({
          item: {
            name,
            quantity: item.quantity || '',
            obtained: item.obtained || false
          },
          index
        })
      }
    },
    removeItem(index) {
      // handle removing empty item
      if (!this.item.name || isEmpty(this.item.name.trim())) {
        const last = this.list.extras.length - 1
        this.remove({ index: last })
      } else {
        this.remove({ index })
      }

      this.$emit('updated:item')
    },
    toggle() {
      const index = this.$vnode.key
      const { item } = this
      const { name, quantity, obtained } = item

      const newItem = { name, quantity: quantity || '', obtained: !obtained }

      this.addItem({
        item: newItem,
        index
      })

      this.item = newItem

      this.$emit('updated:item')
    }
  }
}
</script>

<style lang="scss">
.cupboard-list-item .v-text-field > .v-input__control > .v-input__slot:before {
  border-style: none;

  &:focus {
    border-style: solid;
  }
}

.cupboard-list-item .v-input {
  padding-top: 6px;
}

.cupboard-list-item .v-text-field__details {
  display: none;
}

.success--text .v-input input {
  color: inherit !important;
}
</style>
