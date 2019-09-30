const Redis = require('ioredis')

const options = {
  port: 6378,
  password: 'sky'
}
const redis = new Redis(options)

async function getKeys() {
  await redis.set('age', 19)
  console.log('set')
  const keys = await redis.keys('*')
  console.log(keys)

}

getKeys()
