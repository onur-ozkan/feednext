// Other dependencies
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'
import App from 'next/app'
import ReactGA from 'react-ga'
import Router from 'next/router'
import NProgress from 'nprogress'
import * as kmachine from 'keymachine'
import 'nprogress/nprogress.css'

// Local files
import { store, persistor } from '@/redux/store'
import '@/styles/antd/global.less'

NProgress.configure({ showSpinner: false })
Router.events.on('routeChangeStart', () => NProgress.start())
Router.events.on('routeChangeComplete', () => NProgress.done())
Router.events.on('routeChangeError', () => NProgress.done())
kmachine.configuration.lenght = 16

const AppBase = ({ Component, pageProps }) => {
	if (process.browser) {
		ReactGA.initialize('UA-168030814-1')
		ReactGA.pageview(window.location.pathname + window.location.search)
	}

	return (
		<Provider store={store}>
			<PersistGate loading={<Component {...pageProps} />} persistor={persistor}>
				<Component key={kmachine.keymachine()} {...pageProps} />
			</PersistGate>
		</Provider>
	)
}

AppBase.getInitialProps = async (appContext) => {
	const appProps = await App.getInitialProps(appContext)
	return { ...appProps }
}

export default AppBase