<template>
  <div>
    <h1>CSV Import</h1>
     <div class="mt-2 mb-2">
      Um <select v-model="selectedEntity">
        <option v-for="entity in entities" :value="entity.id" :key="entity.id">{{entity.name}}</option>
      </select> zu importieren, kopieren Sie die CSV-Daten in das Textfeld. Die erste Zeile enthält die Spaltennamen ohne ID.<br>
    </div>
    <div class="mb-2">
      <textarea class="form-control" v-model="csvData" rows=10 required></textarea>
    </div>
    <div class="mb-2 d-flex justify-content-end">
      <button class="btn btn-primary text-white" @click="preview">Vorschau</button>
    </div>
    
    <dialog id="preview">
      <h2 class="h3 d-flex justify-content-center">{{entities[selectedEntity].name}} Import Vorschau</h2>
      <table class="table">
        <caption>Tabelle der zu importierenden Daten</caption>
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
        <button class="btn btn-secondary text-white" @click="closeDialog('preview')">Abbrechen</button>&nbsp;
        <button class="btn btn-primary text-white" @click="finalizeImport" autofocus>{{entities[selectedEntity].name}} importieren</button>
      </menu>
    </dialog>
  </div>
</template>

<script>
import { reactive, ref } from 'vue'
import { openDialog, closeDialog } from '../lib/utils'
import headers from '../lib/auth'

export default {
  name: 'Ranking',

  props: {
    user: Object
  },

  setup() {
    const csvData = ref()
    const selectedEntity = ref(0)
    const entities = [
      {id:0, endpoint:'coins', name:'Coins'}
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
              item[headers[index]] = value
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
      let response = await fetch(`/api/${entities[selectedEntity.value].endpoint}/import`, {...headers, ...opt})
      let index = await response.json()
      console.log(`Insert successful at id ${index}`)
      closeDialog('preview')
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