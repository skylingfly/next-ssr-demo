import React, { Component } from 'react'
import createStore from '../store/store'



const isServer = typeof window === 'undefined'
const __NEXT_REDUX_STORE__ = '__NEXT_REDUX_STORE__'

function getOrCreateStore(initialState) { //store区分处理
  if(isServer) {
    return createStore(initialState)
  }

  if(!window[__NEXT_REDUX_STORE__]) { //浏览器环境如果没有择初始化创建store
    window[__NEXT_REDUX_STORE__] = createStore(initialState)
  }

  return window[__NEXT_REDUX_STORE__]

}



export default (Comp) => {
  class WithRedux extends Component {
    constructor(props) {
      super(props)
      this.reduxStore = getOrCreateStore(props.initialReduxState)
    }
    render (){
      const { Component, pageProps, ...rest} = this.props
      if(pageProps) {
        pageProps.ext = 'name'
      }
  
      return(
      <Comp 
        Component={Component} 
        pageProps={pageProps} 
        reduxStore={this.reduxStore}
        {...rest}/>)
    }
  }
  

  WithRedux.getInitialProps = async (ctx) => {
    const { req } = ctx.ctx
    const session = req && req.session
    let reduxStore;
    if (isServer) {
      if(session && session.userInfo) {
        reduxStore = getOrCreateStore({
          user: session.userInfo
        })
      } else {
        reduxStore = getOrCreateStore()
      }
    } else {
      reduxStore = getOrCreateStore()
    }

    ctx.reduxStore = reduxStore

    let appProps = {}
    if( typeof Comp.getInitialProps === 'function') {
      appProps = await Comp.getInitialProps(ctx)
    }


    return {
      ...appProps,
      initialReduxState: reduxStore.getState()
    }
  }

  return WithRedux

}