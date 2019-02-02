<template>
  <v-data-table
    light
    :headers="headers"
    :items="desserts"
    class="elevation-1 v-card__text"
  >
    <template slot="items" slot-scope="props">
      <td>{{ props.item.name }}</td>
      <td class="text-xs-right">{{ props.item.calories }}</td>
      <td class="text-xs-right">{{ props.item.fat }}</td>
    </template>
  </v-data-table>
</template>

<script>
export default {
  data: () => ({
    headers: [
      {
        text: 'Dessert (100g serving)',
        align: 'left',
        sortable: false,
        value: 'name'
      },
      { align: 'right', text: 'Calories', value: 'calories' },
      { align: 'right', text: 'Fat (g)', value: 'fat' }
    ],
    desserts: [
      {
        value: false,
        name: 'Frozen Yogurt',
        calories: 159,
        fat: 6.0
      },
      {
        value: false,
        name: 'Ice cream sandwich',
        calories: 237,
        fat: 9.0
      },
      {
        value: false,
        name: 'Eclair',
        calories: 262,
        fat: 16.0
      },
      {
        value: false,
        name: 'Cupcake',
        calories: 305,
        fat: 3.7
      },
      {
        value: false,
        name: 'Gingerbread',
        calories: 356,
        fat: 16.0
      },
      {
        value: false,
        name: 'Jelly bean',
        calories: 375,
        fat: 0.0
      },
      {
        value: false,
        name: 'Lollipop',
        calories: 392,
        fat: 0.2
      },
      {
        value: false,
        name: 'Honeycomb',
        calories: 408,
        fat: 3.2
      },
      {
        value: false,
        name: 'Donut',
        calories: 452,
        fat: 25.0
      },
      {
        value: false,
        name: 'KitKat',
        calories: 518,
        fat: 26.0
      }
    ]
  })
}
</script>
