import { Application } from "https://deno.land/x/oak/mod.ts"
import logger from './middleware/logger.ts'
import coinRouter from './routes/coin.ts'
import userRouter from './routes/user.ts'
import portfolioRouter from './routes/portfolio.ts'
import db from './models/Database.ts'
import { Portfolio, Coin, User } from './models/Models.ts'
import { seedUser } from './seeds/seeds.ts' 

// const
const port = 80
const app = new Application()

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
