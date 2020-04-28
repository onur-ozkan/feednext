import { IConfig, IPlugin } from 'umi-types'
import defaultSettings from './defaultSettings' // https://umijs.org/config/

import slash from 'slash2'
import { themePlugin } from './themes'
import proxy from './proxy'
import { routes } from './routes'

const { ANT_DESIGN_PRO_ONLY_DO_NOT_USE_IN_YOUR_PRODUCTION, REACT_APP_ENV } = process.env
const isAntDesignProPreview = ANT_DESIGN_PRO_ONLY_DO_NOT_USE_IN_YOUR_PRODUCTION === 'site'
const plugins: IPlugin[] = [
	['umi-plugin-antd-icon-config', {}],
	[
		'umi-plugin-react',
		{
			antd: true,
			dva: {
				hmr: true,
			},
			locale: {
				// default false
				enable: true,
				// default zh-CN
				default: 'en-US',
				// default true, when it is true, will use `navigator.language` overwrite default
				baseNavigator: true,
			},
			dynamicImport: {
				loadingComponent: './components/PageLoading/index',
				webpackChunkName: true,
				level: 3,
			},
			pwa: defaultSettings.pwa
		},
	],
	[
		'umi-plugin-pro-block',
		{
			moveMock: false,
			moveService: false,
			modifyRequest: true,
			autoAddMenu: true,
		},
	],
]

if (isAntDesignProPreview) {
	plugins.push(['umi-plugin-antd-theme', themePlugin])
}

export default {
	plugins,
	hash: true,
	targets: {
		ie: 11,
	},
	routes,
	theme: defaultSettings,
	define: {
		REACT_APP_ENV: REACT_APP_ENV || false,
		ANT_DESIGN_PRO_ONLY_DO_NOT_USE_IN_YOUR_PRODUCTION: ANT_DESIGN_PRO_ONLY_DO_NOT_USE_IN_YOUR_PRODUCTION || '', // preview.pro.ant.design only do not use in your production ; preview.pro.ant.design 专用环境变量，请不要在你的项目中使用它。
	},
	ignoreMomentLocale: true,
	lessLoaderOptions: {
		javascriptEnabled: true,
	},
	disableRedirectHoist: true,
	cssLoaderOptions: {
		modules: true,
		getLocalIdent: (
			context: {
				resourcePath: string
			},
			_: string,
			localName: string,
		) => {
			if (
				context.resourcePath.includes('node_modules') ||
				context.resourcePath.includes('ant.design.pro.less') ||
				context.resourcePath.includes('global.less')
			) {
				return localName
			}

			const match = context.resourcePath.match(/src(.*)/)

			if (match && match[1]) {
				const antdProPath = match[1].replace('.less', '')
				const arr = slash(antdProPath)
					.split('/')
					.map((a: string) => a.replace(/([A-Z])/g, '-$1'))
					.map((a: string) => a.toLowerCase())
				return `antd-pro${arr.join('-')}-${localName}`.replace(/--/g, '-')
			}

			return localName
		},
	},
	manifest: {
		basePath: '/',
	},
	proxy: proxy[REACT_APP_ENV || 'dev'],
} as IConfig
