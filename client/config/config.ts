// Local files
import { routes } from './routes'
import defaultSettings from './defaultSettings'


export default {
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
}
