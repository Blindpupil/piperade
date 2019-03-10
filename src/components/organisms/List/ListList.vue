<template>
  <v-layout wrap align-self-baseline style="height: auto">
    <v-flex mb-2 xs12 v-for="list in lists" :key="list.name">
      <v-card>
        <v-card-title primary-title>
          <div>
            <div class="headline">{{ list.name }}</div>
            <p class="text-brand-gray">
              {{ list.edited }}
            </p>
            <span
              v-for="item in list.items"
              :key="item.id"
              class="pr-1"
            >
              {{ item.origin }}
            </span>
          </div>
        </v-card-title>

        <v-divider light></v-divider>

        <v-card-actions class="pa-2">
          <v-layout align-center px-2>
            <v-menu bottom left>
              <v-btn slot="activator" class="more-button" icon>
                <v-icon>more_horiz</v-icon>
              </v-btn>

              <v-list>
                <!-- <EditListDialog class="w100" :list="list"> -->
                  <v-list-tile>
                    <v-icon class="small-icon pr-2">edit</v-icon>
                    <v-list-tile-title>Edit</v-list-tile-title>
                  </v-list-tile>
                <!-- </EditListDialog> -->

                <v-list-tile @click="deleteList(list)">
                  <v-icon class="small-icon pr-2">delete</v-icon>
                  <v-list-tile-title style="color: crimson">Delete</v-list-tile-title>
                </v-list-tile>
              </v-list>
            </v-menu>
          </v-layout>

          <v-layout justify-end px-2>
            <v-icon class="medium-icon">
              share
            </v-icon>
          </v-layout>
        </v-card-actions>
      </v-card>
    </v-flex>
  </v-layout>
</template>

<script>
export default {
  data() {
    const d = new Date().toDateString()
    const yd = new Date(2019, 1, 28).toDateString()
    return {
      lists: [
        {
          edited: d,
          name: 'Groceries',
          items: [
            { origin: 'piperade' },
            { origin: 'chili' },
            { origin: 'user items' }
          ]
        },
        {
          edited: yd,
          name: 'House stuff',
          items: [
            { origin: 'sugar' },
            { origin: 'soap' },
            { origin: 'other items' }
          ]
        }
      ]
    }
  }
}
</script>
