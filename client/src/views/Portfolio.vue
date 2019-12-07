<template>
  <div class="about">
    <h1>Portfolio</h1>
    <div class="mdc-data-table">
      <table class="mdc-data-table__table" aria-label="Portfolio">
        <thead>
          <tr class="mdc-data-table__header-row">
            <th class="mdc-data-table__header-cell--checkbox" role="columnheader" scope="col"><input type="checkbox"></th>
            <th class="mdc-data-table__header-cell mdc-data-table__header-cell--numeric" role="columnheader" scope="col">ID</th>
            <th class="mdc-data-table__header-cell" role="columnheader" scope="col">Symbol</th>
            <th class="mdc-data-table__header-cell mdc-data-table__header-cell--numeric" role="columnheader" scope="col">Amount</th>
            <th class="mdc-data-table__header-cell mdc-data-table__header-cell--numeric" role="columnheader" scope="col">Price</th>
            <th class="mdc-data-table__header-cell mdc-data-table__header-cell--numeric" role="columnheader" scope="col">Value</th>
          </tr>
        </thead>
        <tbody class="mdc-data-table__content">
          <tr v-for="(coin,index) in coins" v-bind:key="index" class="mdc-data-table__row">
            <td  class="mdc-data-table__cell--checkbox"><input type="checkbox"></td>
            <td v-for="attr in coin" v-bind:key="attr.id" class="mdc-data-table__cell mdc-data-table__cell--numeric">{{attr}}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
<script>
import axios from 'axios';
export default {
  name: 'portfolio',
  props: [''],
  data() {
    return {
      coins: '',
    };
  },
  methods: {

  },
  async mounted() {
    this.coins = await axios.get('/api/coin')
      .then(response => response.data);
    // console.log(this.coins)
  }
}
</script>
<style>
</style>
