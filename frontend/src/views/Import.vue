<template>
  <div>
    <h1>Portfolio Import</h1>
     <div class="mt-2 mb-2">
       Import CSV data from <a href="https://cointracking.info/current_balance.php" target="_blank">CoinTracking Balance</a>.
    </div>
    <div class="mb-2">
      <textarea class="form-control" v-model="csvData" rows=10 required></textarea>
    </div>
    <div class="mb-2 d-flex justify-content-end">
      <button class="btn btn-primary text-white" @click="preview">Preview</button>
    </div>
    
    <dialog id="preview">
      <h2 class="h3 d-flex justify-content-center">Portfolio Import Preview</h2>
      <table class="table">
        <caption>Coin to be imported</caption>
        <thead>
          <tr>
            <th scope="col" v-for="header in Object.keys(jsonData[0])" :key="header">{{header}}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in jsonData" :key="item">
            <td v-for="val in item" :key="val">{{val}}</td>
          </tr>
        </tbody>
      </table>
      <menu class="d-flex justify-content-end pt-2 mb-1">
        <button class="btn btn-secondary text-white" @click="closeDialog('preview')">Cancel</button>&nbsp;
        <button class="btn btn-primary text-white" @click="finalizeImport">Import portfolio</button>
      </menu>
    </dialog>
  </div>
</template>

<script>
import { reactive, ref } from 'vue'
import router from '../router'
import { openDialog, closeDialog } from '../lib/utils'
import headers from '../lib/auth'

export default {
  name: 'Ranking',

  props: {
    user: Object
  },

  setup(props) {
    const csvData = ref()
    const selectedEntity = ref(0)
    const entities = [
      {id:0, endpoint:'portfolio', name:'Portfolio'}
    ]
    const jsonData = reactive([{}])

    async function preview() {
      if(csvData.value) {
        let data = csvData.value.split('\n')
        // check if we have at least to lines
        if (data.length >= 2) {
          // first line are headers, the rest remains in data
          let headers = data.shift()
          headers = headers.split(',')
          
          jsonData.length = 0
          data.forEach(row => {
            let values = row.split(',')
            let item = {}
            values.forEach((value,index) => {
              item[headers[index].replace(/"/g,'')] = value.replace(/"/g,'')
            })
            jsonData.push(item)
          })
          openDialog('preview')
        } else {
          alert('Mindestens zwei Zeilen erforderlich')
        }
      } else {
        alert('Mindestens zwei Zeilen erforderlich')
      }
    }

    async function finalizeImport() {
      let opt = {}
      opt.method = 'POST'
      opt.body = JSON.stringify(jsonData)
      let response = await fetch(`/api/portfolio/${props.user.id}/import`, {...headers, ...opt})
      let index = await response.json()
      console.log(`Insert successful at id ${index}`)
      closeDialog('preview')
      router.push('/portfolio')
    }
    
    return {
      openDialog,
      closeDialog,
      preview,
      finalizeImport,
      csvData,
      jsonData,
      selectedEntity,
      entities
    }
  },
}
</script>
<style scoped>
dialog {
  width: 90%;
}
</style>