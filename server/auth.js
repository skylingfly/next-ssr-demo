const axios = require('axios')

const config = require('../config')
const { client_id, client_secret, request_token_url } = config.github

module.exports = function(server) {
  server.use(async (ctx, next) => {
    if(ctx.path ==='/auth'){
      const code = ctx.query.code
      if(!code) {
        ctx.body="code 不存在"
        return 
      }
      const result = await axios({
        method: 'POST',
        url: request_token_url,
        headers: {
          Accept: 'application/json'
        },
        data: {
          client_id,
          client_secret,
          code
        }
      })
      if(result.status === 200 && !(result.data && result.data.error)) {
        ctx.session.githubAuth = result.data

        // 请求用户信息
        const { token_type, access_token } = result.data

        const userInfoRes = await axios({
          method: 'GET',
          url: 'https://api.github.com/user',
          headers: {
            Authorization: `${token_type} ${access_token}`
          }
        })
        ctx.session.userInfo = userInfoRes.data
        ctx.redirect((ctx && ctx.session.urlBeforeAuth) || '/')
        ctx.session.urlBeforeAuth = ''
      } else {
        ctx.body = `request token failed ${result.message}`
      }

    } else {
      await next()
    }

  })

  server.use(async (ctx, next) => {
    const path = ctx.path
    const method = ctx.method
    if(path ==='/logout' && method === 'POST'){
      ctx.session = null
      ctx.body = 'logout success'
    } else {
      await next()
    }
  })

  server.use(async (ctx, next) => {
    const path = ctx.path
    const method = ctx.method
    if(path ==='/prepare-auth' && method === 'GET'){
      const { url } = ctx.query
      ctx.session.urlBeforeAuth = url
      ctx.redirect(config.OAUTH_URL)
    } else {
      await next()
    }
  })
}