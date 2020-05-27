// Other dependencies
import { defineConfig } from 'umi'

// Local files
import { routes } from './routes'
import defaultSettings from './defaultSettings'

export default defineConfig({
	ssr: {
		forceInitial: true,
		devServerRender: false,
		mode: 'string',
		staticMarkup: false,
	},
	nodeModulesTransform: {
		type: 'none',
	},
	hash: true,
	routes,
	theme: defaultSettings.theme,
	manifest: {
		basePath: '/',
	},
})
