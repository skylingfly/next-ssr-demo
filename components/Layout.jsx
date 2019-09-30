import { useState, useCallback } from 'react'
import getConfig from 'next/config'
import { withRouter } from 'next/router';
import { connect } from 'react-redux'
import Link from 'next/link'
import axios from 'axios'
import { Layout, Icon, Input, Avatar, Dropdown, Tooltip, Menu } from 'antd'

import Container from './container'
import { logout } from '../store/actions/user'
const { Header, Content, Footer } = Layout
const { Search } = Input
const { publicRuntimeConfig } = getConfig()

const githubIconStyle = {
  color: 'white',
  fontSize: 40,
  display: 'block',
  paddingTop: 10,
  marginRight: 20
}

const footerStyle = {
  textAlign: 'center'
}

const LayoutWrap = ({ children, user, logout, router }) => {
  const initquery = router.query && router.query.query
  const [search, setSearch] = useState(initquery || '')

  const handleSearchChange = useCallback((e) => {
    setSearch(e.target.value)
  },[setSearch])

  const handleOnSearch = useCallback(() => {
    router.push(`/search?query=${search}`)
  },[search])

  const handleLogout = useCallback(() => {
    logout()
  },[])

  const userDrop = () => {
    return (
      <Menu>
        <Menu.Item>
          <span onClick={handleLogout}>
            登 出
          </span>
        </Menu.Item>
      </Menu>
    )
  }

  return (
  <Layout>
    <Header>
      <div className="header-inner">
        <div className="header-left">
          <div className="logo">
            <Link href="/">
              <a>
                <Icon type="github" style={githubIconStyle}/>
              </a> 
            </Link>
          </div>
          <div>
            <Search placeholder="search repo" 
              value={search} 
              onChange={handleSearchChange}
              onSearch={handleOnSearch}
            />
          </div>
        </div>
        <div className="header-right">
          <div className="user">
          {
            user && user.id ?(
              <Dropdown overlay={userDrop}>
                <a href="/">
                  <Avatar size={40} src={user.avatar_url} />
                </a>    
              </Dropdown>
              
            ): (
            <Tooltip title="please click to login" placement="topRight">
              <a href={`/prepare-auth?url=${router.asPath}`}>
                <Avatar size={40} icon="user" />
              </a>
            </Tooltip>
            )
          }
          </div>
        </div>
      </div>
    </Header>
    <Content>
      <Container renderr={<div style={{fontSize: 20 }}/>} >
        {children}
      </Container>
    </Content>
    <Footer style={footerStyle}>
      Created by SkyFly@
      <a href="mailto:694531562@qq.com">SkyFly</a>
    </Footer>
    <style jsx>{`
      .header-inner {
        display: flex;
        justify-content: space-between
      }
      .header-left{
        display: flex;
        justify-content: flex-start
      }
    `}
    </style>
    <style jsx global>{`
      #__next {
        height: 100%
      }
      .ant-layout {
        min-height: 100%
      }
      .ant-layout-content{
        background-color: #fff
      }
      .ant-layout-header {
        padding: 0 20px
      }
  `}</style>
  </Layout>
)}

function mapState(state) {
  return {
    user: state.user
  }
}

function mapDispatch(dispatch) {
  return {
    logout: () => dispatch(logout())
  }
}


export default withRouter(connect(mapState, mapDispatch)(LayoutWrap))