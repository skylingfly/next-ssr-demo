const GITHUB_OAUTH_URL = 'https://github.com/login/oauth/authorize'
const SCOPE = 'user'
const client_id = 'Iv1.c8e748bec4e449fa'
module.exports = {
  github: {
    request_token_url: 'https://github.com/login/oauth/access_token',
    client_id,
    client_secret: '9e4c61f1e147e0db030430fff22babc475fb6850'
  },
  GITHUB_OAUTH_URL,
  OAUTH_URL: `${GITHUB_OAUTH_URL}?client_id=${client_id}&scope=${SCOPE}`
}