import '../test.css'
import Link from 'next/link'
import Router from 'next/router'
import {Button} from 'antd'
import getConfig from 'next/config'
import { connect } from 'react-redux'
import React, { Component, useEffect } from 'react';
import axios from 'axios'

import { add } from '../store/store'

const { publicRuntimeConfig } = getConfig()
// const eventslist = [
//   'routeChangeStart',
//   'routeChangeComplete',
//   'routeChangeError',
//   'beforeHistoryChange',
//   'hashChangeStart',
//   'hashChangeComplete'
// ]

// const makeEvents = (event) => {
//   return function(...args) {
//     console.log(...args, event )
//   }
// }

// eventslist.forEach(v => {
//   Router.events.on(v, makeEvents(v))
// })

const Index = ({ count, username, rename, add }) => {

  function handleJump() {
    Router.push({
      pathname:'/test/b',
      query: {
        id: '2333'
      }
    }, '/test/b/2333')
  }

  useEffect(()=> {
    axios.get('/api/user/info').then(res => {
      console.log(res.data, 'xxx')
    })
  },[])

  return <>
  <span>count: {count}</span>
  <br></br>
  <a>username: {username}</a>
  <br></br>
  <input placeholder="输入姓名" onChange={(e) => rename(e.target.value)}/>
  <button onClick={()=> add(count)}>Add</button> 
  <a href={publicRuntimeConfig.OAUTH_URL}> 去登陆 </a>
</>
  
}

Index.getInitialProps = ({ reduxStore }) => {
  reduxStore.dispatch(add(5))
  
  return {}

}

function mapStateToProps(state) {
  return {
    username: state.user.name,
    count: state.counter.count
  }
}

function mapDisPatch(dispatch) {
  return {
    add: (num) => dispatch({type: 'ADD', num}),
    rename: (name) => dispatch({type: 'UPDATE_USERNAME', name})
  }
}

export default connect(mapStateToProps, mapDisPatch)(Index)

  

