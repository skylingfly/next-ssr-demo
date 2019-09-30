import App from 'next/app'
import 'antd/dist/antd.css'
import { Provider } from 'react-redux'
import Router from "next/router";
import Link from 'next/link'

import Layout from '../components/Layout'
import WithRedux from '../lib/with-redux'
import PageLoading from '../components/PageLoading'
import axios from 'axios';

class WrapApp extends App{
  state = {
    context: 'content',
    loading: false
  }

  StartLoading = () => {
    this.setState({loading: true})
  }

  StopLoading = () => {
    this.setState({loading: false})
  }



  componentDidMount() {
    Router.events.on('routeChangeStart', this.StartLoading)
    Router.events.on('routeChangeComplete', this.StopLoading)
    Router.events.on('routeChangeError', this.StopLoading)

    // axios
    //   .get('/github/search/repositories?q=react')
    //   .then(resp => console.log(resp, 'result'))
  }

  componentWillUnmount() {
    Router.events.off('routeChangeStart', this.StartLoading)
    Router.events.off('routeChangeComplete', this.StopLoading)
    Router.events.off('routeChangeError', this.StopLoading)
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
        <Provider store={reduxStore}>
        {
          this.state.loading && <PageLoading />
        }
          <Layout>
            <Component { ...pageProps }/>
          </Layout>
        </Provider>
      </>
    )
  }
}

export default WithRedux(WrapApp)