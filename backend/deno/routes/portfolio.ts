import { oak } from '../deps.ts'
import { Portfolio, Coin } from "../db/models/Models.ts"

const router = new oak.Router()

// read all positions
router.get('/:uid', async ctx => {
  let uid = ctx.params.uid || ''
  let result = await Portfolio
    .select('portfolio.id', 'portfolio.amount', 'portfolio.coinid','coins.ranking', 'coins.name' ,'coins.symbol', 'coins.price', 'coins.marketcap')
    .join(Coin, Coin.field('id'), Portfolio.field('coinid'))
    .where('portfolio.userid', uid)
    .orderBy('ranking')
    .all()
  ctx.response.status = oak.Status.OK
  ctx.response.body = result
})

export default router