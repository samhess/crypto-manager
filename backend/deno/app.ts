import { Application } from "https://deno.land/x/oak/mod.ts"

import logger from './middleware/logger.ts'
import coinRouter from './routes/coin.ts'
import userRouter from './routes/user.ts'
import portfolioRouter from './routes/portfolio.ts'

// Initialise app
const port = 80
const app = new Application()

app.use(logger)

app.use(coinRouter.prefix('/api/coin').routes())

app.use(userRouter.prefix('/api/user').routes())

app.use(portfolioRouter.prefix('/api/portfolio').routes())

import db from './models/database.ts'
import { Portfolio, Coin, User } from './models/Models.ts'
let database = db.link([Portfolio,Coin,User])
console.log(database)

console.log(`🚀 Deno running on http://localhost:${port}!`)
await app.listen({ port })