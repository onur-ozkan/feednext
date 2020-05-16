// Other dependencies
import { defineConfig } from 'umi'

// Local files
import { routes } from './routes'
import defaultSettings from './defaultSettings'

export default defineConfig({
	routes,
	ssr: {
		forceInitial: false,
		devServerRender: true,
		mode: 'stream',
		staticMarkup: false,
	},
	nodeModulesTransform: {
		type: 'none',
	},
	theme: defaultSettings.theme,
	manifest: {
		basePath: '/',
	},
})
