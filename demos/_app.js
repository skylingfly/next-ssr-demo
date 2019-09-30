import App from 'next/app'
import 'antd/dist/antd.css'
import { Provider } from 'react-redux'

import Layout from '../components/Layout'
import MyContext from '../lib/MyContext'
import TestHoc from '../lib/with-redux'

class WrapApp extends App{
  state = {
    context: 'content'
  }
  static async getInitialProps(appContext) {
    const { Component } = appContext
    let pageProps={};
    if(Component.getInitialProps) {
      pageProps = await Component.getInitialProps(appContext);
    }
    
    return {
      pageProps
    }
  }

  render() {
    const { Component, pageProps, reduxStore } = this.props

    return (
      <>
        <Layout>
          <Provider store={reduxStore}>
            <MyContext.Provider value={this.state.context}>
              <Component { ...pageProps }/>
            </MyContext.Provider>
          </Provider>
        </Layout>
      </>
    )
  }
}

export default TestHoc(WrapApp)