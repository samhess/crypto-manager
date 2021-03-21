import { oak } from '../deps.ts'
import { Coin } from "../db/models/Models.ts"

const router = new oak.Router()

const cmc = {
  api : 'https://pro-api.coinmarketcap.com/v1',
  headers : {'X-CMC_PRO_API_KEY': '537aff70-7beb-4491-ae8e-852501fc9259'},
  limit: 500,
  currency : 'USD'
}
var lastUpdate = 0

router.get('/', async ctx => {
  let coins = await Coin.orderBy('ranking').all()
  ctx.response.status = oak.Status.OK
  ctx.response.body = coins
})

router.get('/symbol', async ctx => {
  let symbols = await Coin.select('id','symbol').orderBy('symbol').all()
  ctx.response.status = oak.Status.OK
  ctx.response.body = symbols
})

router.get('/market/update', async ctx => {
  let url = new URL(`${cmc.api}/global-metrics/quotes/latest`)
  let response = await fetch(url, {headers: cmc.headers})
  let data = await response.json()
  ctx.response.status = oak.Status.OK
  ctx.response.body = data.data
})

export default router