const webpack = require('webpack')

const withCSS = require('@zeit/next-css')
const withLess = require('@zeit/next-less')
const lessToJS = require('less-vars-to-js')

const fs = require('fs')
const path = require('path')
const themeVariables = lessToJS(fs.readFileSync(path.resolve(__dirname, './config/override.less'), 'utf8'))

const { nextI18NextRewrites } = require('next-i18next/rewrites')
const localeSubpaths = {}

module.exports = withCSS(withLess({
	rewrites: async () => nextI18NextRewrites(localeSubpaths),
	publicRuntimeConfig: {
		localeSubpaths,
	},
	lessLoaderOptions: {
		javascriptEnabled: true,
		modifyVars: themeVariables // make your antd custom effective
	},
	webpack: (config, { isServer }) => {
		config.plugins.push(
			new webpack.EnvironmentPlugin(process.env)
		)

		config.module.rules.push({
			test: /\.(png|jpg|gif|svg|eot|ttf|woff|woff2)$/,
			use: {
				loader: 'url-loader',
				options: {
					limit: 100000
				}
			}
		})

		if (isServer) {
			const antStyles = /antd\/.*?\/style.*?/
			const origExternals = [...config.externals]
			config.externals = [
				(context, request, callback) => {
					if (request.match(antStyles)) return callback()
					if (typeof origExternals[0] === 'function') {
						origExternals[0](context, request, callback)
					} else {
						callback()
					}
				},
				...(typeof origExternals[0] === 'function' ? [] : origExternals)
			]

			config.module.rules.unshift({
				test: antStyles,
				use: 'null-loader'
			})
		}
		return config
	}
}))
