const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer')
const withLess = require('@zeit/next-less')

module.exports = withLess({
    lessLoaderOptions: {
        javascriptEnabled: true
    },
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
})
