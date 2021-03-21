import { oak } from './deps.ts'
import logger from './middleware/logger.ts'
import { coinRouter, userRouter, portfolioRouter } from './routes/routes.ts'
import db from './db/Database.ts'
import { Portfolio, Coin, User } from './db/models/Models.ts'
import { seedUser } from './db/seeds/seeds.ts' 

// const
const port = 80
const app = new oak.Application()

// middlewares
app.use(logger)
app.use(coinRouter.prefix('/api/coin').routes())
app.use(userRouter.prefix('/api/user').routes())
app.use(portfolioRouter.prefix('/api/portfolio').routes())

db.link([User,Coin,Portfolio])
// db.sync({drop:true})
// seedUser()

app.listen({ port })
console.log(`🚀 Deno running on http://localhost:${port}!`)
