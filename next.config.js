const withCss = require('@zeit/next-css')
const webpack = require('webpack')
const config = require('./config')
const withBundleAnalyzer = require("@zeit/next-bundle-analyzer")

const { GITHUB_OAUTH_URL, OAUTH_URL } = config

const configs = {
  // 编译文件输出目录 
  distDir: 'build',
  generateEtags: true,
  onDemandEntries: {
    // period (in ms) where the server will keep pages in the buffer
    maxInactiveAge: 25 * 1000,
    // number of pages that should be kept simultaneously without being disposed
    pagesBufferLength: 2,
  },
  pageExtensions: [ 'jsx', 'js'],// pages 下面文件
  generateBuildId: async () => {
    // When process.env.YOUR_BUILD_ID is undefined we fall back to the default
    if (process.env.YOUR_BUILD_ID) {
      return process.env.YOUR_BUILD_ID
    }

    return null
  },
  // 手动修改webpack config
  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
    // Note: we provide webpack above so you should not `require` it
    // Perform customizations to webpack config
    // Important: return the modified config

    // Example using webpack option
    config.plugins.push(new webpack.IgnorePlugin(/\/__tests__\//))
    return config
  },
  webpackDevMiddleware: config => {
    // Perform customizations to webpack dev middleware config
    // Important: return the modified config
    return config
  },
  env: {//业务代码 process.env.customKey获取value
    customKey: 'value',
  },
  // Only holds serverRuntimeConfig and publicRuntimeConfig from next.config.js nothing else.
  // const { serverRuntimeConfig, publicRuntimeConfig } = getConfig()
  serverRuntimeConfig: {
    // Will only be available on the server side
    mySecret: 'secret',
    secondSecret: process.env.SECOND_SECRET, // Pass through env variables
  },
  publicRuntimeConfig: {
    // Will be available on both server and client
    staticFolder: '/static',
  },

}

if (typeof require !== undefined) {
  require.extensions['.css'] = file => {

  }
}

module.exports = withBundleAnalyzer(withCss({
  webpack(config) {
    config.plugins.push(new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),)
    return config
  },
  publicRuntimeConfig: {
    // Will be available on both server and client
    GITHUB_OAUTH_URL,
    OAUTH_URL
  },
  analyzeServer: ["server", "both"].includes(process.env.BUNDLE_ANALYZE),
  analyzeBrowser: ["browser", "both"].includes(process.env.BUNDLE_ANALYZE),
  bundleAnalyzerConfig: {
    server: {
      analyzerMode: 'static',
      reportFilename: '../../bundles/server.html'
    },
    browser: {
      analyzerMode: 'static',
      reportFilename: '../bundles/client.html'
    }
  }
}))