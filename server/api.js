const axios =require('axios')
const { requestGithub } = require('../lib/request')


module.exports = (server) => {
  server.use(async(ctx, next) => {
    const { path, url } = ctx
    
    if(path.startsWith('/github/')){
      const session = ctx.session
      const githubAuth = session && session.githubAuth
      const headers = {}
      if (githubAuth && githubAuth.access_token) {
        headers['Authorization'] = `${githubAuth.token_type} ${githubAuth.access_token}`
      }

      const result = await requestGithub(
        ctx.method,
        url.replace('/github/', '/'),
        ctx.request.body || {},
        headers
      )

      ctx.status = result.status
      ctx.body = result.data

    } else {
      await next()
    }

  })
}



// module.exports = (server) => {
//   server.use(async(ctx, next) => {
//     const { path, url } = ctx
//     if(path.startsWith('/github/')){
//       const githubAuth = ctx.session.githubAuth
//       const githubPath = `${github_base_url}${url.replace('/github/', '/')}`

//       const headers = {}
//       const token = githubAuth && githubAuth.access_token
//       if (token) {
//         headers['Authorization'] = `${githubAuth.token_type} ${token}`
//       }

//       try {

//         const result = await axios({
//           method: 'GET',
//           url: githubPath,
//           headers
//         })

//         if (result.status ===200) {
//           ctx.body = result.data
//           ctx.set('Content-Type', 'application/json')
//         } else {
//           ctx.status = result.status
//           ctx.body = {
//             success: false
//           }
//           ctx.set('Content-Type', 'application/json')
//         }
        
//       } catch (error) {
//         console.log(error)
//         ctx.body = {
//           success: false
//         }
//         ctx.set('Content-Type', 'application/json')
//       }
     

//     } else {
//       await next()
//     }
//   })
// }