<template>
  <v-combobox
    v-model="model"
    :filter="filter"
    :hide-no-data="!search"
    :hint="hint"
    :items="items"
    :search-input.sync="search"
    hide-selected
    label="Search for an option or create one"
    multiple
    small-chips
    solo
  >
    <template slot="no-data">
      <v-list-tile>
        <span class="subheading">Create</span>
        <v-chip
          :color="`${colors[nonce - 1]} lighten-3`"
          label
          small
        >
          {{ search }}
        </v-chip>
      </v-list-tile>
    </template>

    <template
      v-if="item === Object(item)"
      slot="selection"
      slot-scope="{ item, parent, selected }"
    >
      <v-chip
        :color="`${item.color} lighten-3`"
        :selected="selected"
        label
        small
      >
        <span class="pr-2">
          {{ item.text }}
        </span>
        <v-icon small @click="parent.selectItem(item)">close</v-icon>
      </v-chip>
    </template>

    <template slot="item" slot-scope="{ index, item }">
      <v-list-tile-content>
        <v-text-field
          v-if="editing === item"
          v-model="editing.text"
          autofocus
          flat
          background-color="transparent"
          hide-details
          solo
          @keyup.enter="edit(index, item)"
        ></v-text-field>
        <v-chip
          v-else
          :color="`${item.color} lighten-3`"
          class="font-weight-bold"
          dark
          label
          small
        >
          {{ item.text }}
        </v-chip>
      </v-list-tile-content>

      <v-spacer></v-spacer>

      <v-list-tile-action @click.stop>
        <v-btn icon @click.stop.prevent="edit(index, item)">
          <v-icon>{{ editing !== item ? 'edit' : 'check' }}</v-icon>
        </v-btn>
      </v-list-tile-action>
    </template>
  </v-combobox>
</template>

<script>
import { isEmpty } from 'lodash-es'
import { SET_CATEGORIES } from '@/store/types/mutation_types'

export default {
  name: 'CupboardItemBox',
  data: () => ({
    activator: null,
    attach: null,
    colors: ['purple', 'indigo', 'cyan', 'teal', 'orange', 'pink', 'brown', 'blue-grey'],
    editing: null,
    hint: 'This will help us organize them for you',
    index: -1,
    items: [
      { header: 'Select a category or create one' },
      {
        text: 'Vegetarian',
        color: 'green'
      },
      {
        text: 'Vegan',
        color: 'light-green'
      },
      {
        text: 'Low carb',
        color: 'blue'
      },
      {
        text: 'High protein',
        color: 'red'
      },
      {
        text: 'Lactose free',
        color: 'deep-purple'
      },
      {
        text: 'Breakfast',
        color: 'cyan'
      },
      {
        text: 'Dinner',
        color: 'deep-orange'
      },
      {
        text: 'Fatty',
        color: 'amber'
      }
    ],
    nonce: 1,
    menu: false,
    model: [],
    search: null
  }),
  watch: {
    model(val, prev) {
      if (val.length === prev.length) return

      this.model = val.map((v) => {
        if (typeof v === 'string') {
          // eslint-disable-next-line
          v = {
            text: v,
            color: this.colors[this.nonce - 1]
          }

          this.items.push(v)
          this.nonce += 1
        }

        return v
      })

      this.$store.commit(SET_CATEGORIES, this.model)
    }
  },
  methods: {
    edit(index, item) {
      if (!this.editing) {
        this.editing = item
        this.index = index
      } else {
        this.editing = null
        this.index = -1
      }
    },
    filter(item, queryText, itemText) {
      if (item.header) return false

      const text = isEmpty(itemText) ? '' : itemText
      const query = isEmpty(queryText) ? '' : queryText

      return text.toString()
        .toLowerCase()
        .indexOf(query.toString().toLowerCase()) > -1
    }
  }
}
</script>
