<template>
<div id="app">
  <v-app id="inspire">

    <v-data-table  :headers="headers" :items="desserts"  :items-per-page="5"  class="elevation-1" >

      <template v-slot:item.protein="props">
        <v-text-field  v-model="props.item.protein"  name="quantity"  outlined  @input="getdata"  type="number"></v-text-field>
      </template>

    </v-data-table>

  </v-app>
</div>
</template>

<script>
export default {
  data () {
    return {
      headers: [
        {  text: 'Dessert (100g serving)', align: 'left', sortable: false, value: 'name', },
        { text: 'Calories', value: 'calories' },
        { text: 'Fat (g)', value: 'fat' },
        { text: 'Carbs (g)', value: 'carbs' },
        { text: 'Protein (g)', value: 'protein' },
        { text: 'Iron (%)', value: 'iron' },
      ],
      desserts: [
        {
          name: '1',
          calories: 159,
          fat: 6.0,
          carbs: 24,
          protein: 4.0,
          iron: '1%', },
        {
          name: '2',
          calories: 159,
          fat: 6.0,
          carbs: 24,
          protein: 4.0,
          iron: '1%', },
        {
          name: '3',
          calories: 159,
          fat: 6.0,
          carbs: 24,
          protein: 4.0,
          iron: '1%', },
      ],
    }
  },
  methods: {
    getdata() {
      console.log(this.desserts[0].protein);
    }
  },
}
</script>
