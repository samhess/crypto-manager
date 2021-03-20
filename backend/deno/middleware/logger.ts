import { Context } from "https://deno.land/x/oak/mod.ts"

const logger = async function (ctx:Context, next:() => Promise<void>) {
  await next()
  console.log(`${ctx.request.method} ${ctx.request.url}`)
}

export default logger