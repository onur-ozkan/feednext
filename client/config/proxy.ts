/**
 * The agent cannot take effect in the production environment
 * so there is no configuration of the production environment
 * For details, please see
 * https://pro.ant.design/docs/deploy
 */
export default {
	dev: {
		'/api/': {
			target: 'https://preview.pro.ant.design',
			changeOrigin: true,
			pathRewrite: {
				'^': '',
			},
		},
	},
	test: {
		'/api/': {
			target: 'https://preview.pro.ant.design',
			changeOrigin: true,
			pathRewrite: {
				'^': '',
			},
		},
	},
	pre: {
		'/api/': {
			target: 'your pre url',
			changeOrigin: true,
			pathRewrite: {
				'^': '',
			},
		},
	},
}
