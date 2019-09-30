import { connect } from 'react-redux';
import { useEffect } from 'react';
import { Button, Icon, Tabs } from "antd"
import getConfig from 'next/config'
import Router, {withRouter} from 'next/router';
import LRU from 'lru-cache'

const { publicRuntimeConfig } = getConfig()
import { request, requestGithub } from '../lib/request'
import { cacheArray } from '../lib/repo-basic-cache'
const Cache = new LRU({
  maxAge: 1000 * 10
})

import Repo from '../components/Repo.jsx'

const isServer = typeof window === 'undefined'

function Index({userRepos, userStarReops, user, router}) {
  const tabKey = router.query.key

  const handleChangeTab = (key) => {
    Router.push(`/?key=${key}`)
  }

  useEffect(() => {
    if(!isServer) {
      // cacheduserRepos = userRepos
      // cacheduserStarReops = userStarReops
      userRepos && Cache.set('userRepos', userRepos)
      userStarReops && Cache.set('userStarReops', userStarReops)
    }

    
  },[userRepos, userStarReops ])

  useEffect(()=> {
    if(!isServer) {
      userRepos && cacheArray(userRepos)
      userStarReops && cacheArray(userStarReops)
    } 
  })

  if(!user || !user.id) {
    return <div className="root">
      <p>用户未登陆,请登录~</p>
      <Button type="primary" href={publicRuntimeConfig.OAUTH_URL}>点击登陆</Button>
      <style jsx>{`
        .root{
          height: 400px;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
        }
      `}</style>
    </div>
  }
  return (
    <div className="root">
      <div className="userinfo">
        <img src={user.avatar_url} alt="user avatar" className="avatar"/>
        <span className="login">{user.login}</span>
        <span className="name">{user.name}</span>
        <span className="bio">{user.bio}</span>
        { user.email && <p className="email">
          <Icon type="mail" style={{marginRight: 10}}/>
          <a href={`mailto:${user.email}`}>{user.email}</a>
        </p>}
      </div>
      <div className="user-repos">
      <Tabs defaultActiveKey={tabKey} onChange={handleChangeTab} animated={false}>
        <Tabs.TabPane tab="你的仓库" key="1">
        {
          userRepos && userRepos.map(v => <Repo repo={v} key={v.id}/>)
        }
        </Tabs.TabPane>
        <Tabs.TabPane tab="你关注的仓库" key="2">
        {
          userStarReops && userStarReops.map(v => <Repo repo={v} key={v.id}/>)
        }
        </Tabs.TabPane>
      </Tabs>
        
      </div>
      <style jsx>{`
        .root{
          display: flex;
          padding: 20px 0
        }
        .userinfo{
          width: 200px;
          margin-right: 40px;
          display: flex;
          flex-shrink: 0;
          flex-direction: column;
        }
        .login{
          font-weight: 700;
          font-size: 20px;
          margin-top: 20px;
        }
        .name {
          font-size: 14px;
          color: #666
        }
        .bio {
          margin-top: 20px;
          color: #333;
          font-size: 15px;
        }
        .avatar{
          width: 100%;
          border-radius: 5px
        }

        .user-repos{
          flex-grow: 1
        }

      `}</style>
    </div>
  )
}

Index.getInitialProps = async({ctx, reduxStore}) => {
  const { user } = reduxStore.getState()
  if (!user || !user.id) {
    return {}
  }
  if(!isServer) {
    if (Cache.get('userRepos') && Cache.get('userStarReops')) {
      return {
        userRepos: Cache.get('userRepos'),
        userStarReops: Cache.get('userStarReops')
      }
    }
    
  }
  try {
    const res = await request({url: '/user/repos'}, ctx.req, ctx.res)

    const userStarReops = await request({url: '/user/starred'}, ctx.req, ctx.res)
      
    return {
      userRepos: res.data,
      userStarReops: userStarReops.data
    }
  } catch (error) {
    console.log(error)
    return {}
  }
  
}
function mapState(state) {
  return {
    user: state.user
  }
}


export default withRouter(connect(mapState)(Index))