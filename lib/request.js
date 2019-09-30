
/**
 * 处理服务端与客户端请求
 * by sky
 */
const axios = require('axios')
const isServer = typeof window === 'undefined'
const github_base_url = 'https://api.github.com'

function requestGithub(method, url, data, headers) {
  return axios({
    url: `${github_base_url}${url}`,
    data,
    headers,
    method
  })
}

function request({method = "GET", url, data}, req, res) {
  if (!url) {
    throw Error('url must provided')
  }
  if (isServer) {
    const session = req && req.session
    const githubAuth = session && session.githubAuth || {}
    const headers = {}
    if (githubAuth.access_token) {
      headers['Authorization'] = `${githubAuth.token_type} ${githubAuth.access_token}`
    }

    return requestGithub(method, url, data, headers)
  }

  return axios({
    url: `/github${url}`,
    data,
    method
  })
}

module.exports = {
  request,
  requestGithub
}