import * as bcrypt from "https://deno.land/x/bcrypt/mod.ts"
import { User } from '../models/Models.ts'
const password = bcrypt.hashSync('pass')

async function seedUser() {
  await User.create([
    { firstname: '', lastname: '', username: 'demo', role: 'user', status: 'enabled', password },
    { firstname: '', lastname: '', username: 'admin', role: 'admin', status: 'enabled', password }
  ])
}

export { seedUser }