import { Application, Router, Status } from "https://deno.land/x/oak/mod.ts"

import Coin from './models/Coin.ts'
import User from './models/User.ts'
import Portfolio from './models/Portfolio.ts'
import db from './models/database.ts'
db.link([Coin,User,Portfolio])

import coinRoutes from './routes/coin.ts'
import userRoutes from './routes/user.ts'
import portfolioRoutes from './routes/portfolio.ts'

// Initialise app
const app = new Application()

// Initialise router
const router = new Router()

// Create first default route
router.get('/', ctx => {
  ctx.response.status = Status.OK
  ctx.response.body = { message: 'It works!' }
})


// Logger
app.use(async (ctx, next) => {
  await next()
  console.log(`${ctx.request.method} ${ctx.request.url}`)
})


app.use(router.routes())
app.use(router.allowedMethods())

app.use(coinRoutes.prefix('/api/coin').routes())
app.use(coinRoutes.allowedMethods())

app.use(userRoutes.prefix('/api/user').routes())
app.use(userRoutes.allowedMethods())

app.use(portfolioRoutes.prefix('/api/portfolio').routes())
app.use(portfolioRoutes.allowedMethods())

console.log('Database connected!')

console.log('🚀 Deno start !')
await app.listen('0.0.0.0:80')