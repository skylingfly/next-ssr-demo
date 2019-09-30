const Koa = require('koa')
const next = require('next')
const Router = require('koa-router')
const session = require('koa-session')
const Redis = require('ioredis')
const koaBody = require('koa-body')
const atob = require('atob')

const SessionStore = require('./server/session-store')
const auth = require('./server/auth')
const api = require('./server/api')

global.atob = atob

const dev = process.env.NODE_ENV !== 'production'
const app = next({ dev })
const handle = app.getRequestHandler()

const redisClient = new Redis({
  port: 6379
})

app.prepare().then(() => {
    const server = new Koa()
    const router = new Router()
    server.keys = ['Sky develop github app']
    const SESSION_CONFIG = {
      key: 'sid', /** (string) cookie key (default is koa:sess) */
      maxAge: 12* 60 * 60 * 1000,
      store: new SessionStore(redisClient)
    }

    server.use(session(SESSION_CONFIG, server))

    server.use(koaBody())

    // 配置github 登录
    auth(server)

    api(server)

    router.get('/a/:id', async(ctx) => {
      const { id } = ctx.params
     
      await handle(ctx.req, ctx.res, {
        pathname: '/a',
        query: { id }
      })
      ctx.respond = false
    })

    router.get('/api/user/info', async(ctx) => {
      const user = ctx.session.userInfo

      if(!user) {
        ctx.status = 401
        ctx.body = 'Need Login'
      } else {
        ctx.body = user
        ctx.set('Content-Type', 'application/json')
      }
      
    })

    router.get('/set/user', async(ctx) => {
      ctx.session.user = {
        name: 'sky',
        age: 18
      }
      ctx.body = 'set session success'
    })

    router.get('/del/user', async(ctx) => {
      ctx.session = null
      ctx.body = 'del session success'
    })

    router.post('/logout', async(ctx) => {
      ctx.session = null
      ctx.body = 'del session success'
    })

    server.use(router.routes())

    server.use(async (ctx, next) => {
      ctx.req.session = ctx.session
      await handle(ctx.req, ctx.res)
      ctx.respond = false
    })

    server.use(async (ctx, next) => {
      ctx.res.statusCode = 200
      await next()
    })
    
    server.listen(4000, () => {
      console.log(`server start on 4000`)
    })
  }
)