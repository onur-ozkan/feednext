const {BundleAnalyzerPlugin} = require('webpack-bundle-analyzer')
const withCSS = require('@zeit/next-css')

module.exports = withCSS(
  {
    webpack(config) {
      if (process.env.ANALYZE) {
        config.plugins.push(new BundleAnalyzerPlugin({
          analyzerMode: 'server',
          analyzerPort: 8888,
          openAnalyzer: true
        }))
      }
      return config
    }
  }
)
