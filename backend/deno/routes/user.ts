
import { oak } from '../deps.ts'
import { bcrypt } from '../deps.ts'
import { djwt } from '../deps.ts'
import  User  from '../db/models/User.ts'

const router = new oak.Router()

router.post('/login', async ctx => {
  let credentials = await ctx.request.body().value
  if (credentials.username && credentials.password) {
    let user = await User.where('username', credentials.username).first()
    if (user !== undefined) {
      let pass = user.password as string
      let check = bcrypt.compareSync(credentials.password, pass)
      if (check) {
        let time = Math.floor(Date.now()/1000)
        let payload = { 
          iat: time,
          exp: time + 3600,
          id:user.id, 
          username:user.username, 
          role:user.role
        }
        let token = await djwt.create({ alg: "HS512", typ: "JWT" }, payload, "secret")
        ctx.response.status = oak.Status.OK
        ctx.response.body = {token}
      } else {
        ctx.response.status = oak.Status.OK
        ctx.response.body = {message: 'Username or password is incorrect!'}
      }
    } else {
      ctx.response.status = oak.Status.OK
      ctx.response.body = {message: 'Username or password is incorrect!'}
    }
  }
})

export default router