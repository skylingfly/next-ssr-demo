
function getRedisSessionId(sid) {
  return `ssid:${sid}`
}

class RedisSessionStore {

  constructor(client) {
    this.client = client
  }
  // 获取redis存储session数据
  async get(sid) {
    const id = getRedisSessionId(sid)
    try {
      const data = await this.client.get(id)
      if(!data) {
        return null
      }
      const result = JSON.parse(data)
      return result
    } catch (err) {
      console.error(err)
    } 
  }

  // set session 到 redis
  async set(sid, sess, ttl) {
    const id = getRedisSessionId(sid)
    if(typeof ttl === 'number') {
      ttl = Math.ceil(ttl/1000)
    }
    try {
      const sessStr = JSON.stringify(sess)
      if(ttl) {
        await this.client.set(id, sessStr, 'EX', ttl )
      } else {
        await this.client.set(id, sessStr)
      }
    } catch (err) {
      console.error(err)
    }
  }

  // destory redis session
  async destroy(sid) {
    const id = getRedisSessionId(sid)
    try {
      await this.client.del(id)
    } catch (err) {
      console.error(err)
    }
  }

}

module.exports = RedisSessionStore