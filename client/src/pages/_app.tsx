// Other dependencies
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'
import App from 'next/app'
import ReactGA from 'react-ga'

// Local files
import { store, persistor } from '@/redux/store'
import '@/styles/antd/global.less'

const AppBase = ({ Component, pageProps }) => {
	if (process.browser) {
		ReactGA.initialize('UA-168030814-1')
		ReactGA.pageview(window.location.pathname + window.location.search)
	}

	return (
		<Provider store={store}>
			<PersistGate loading={<Component {...pageProps} />} persistor={persistor}>
				<Component {...pageProps} />
			</PersistGate>
		</Provider>
	)
}

AppBase.getInitialProps = async (appContext) => {
	const appProps = await App.getInitialProps(appContext)
	return { ...appProps }
}

export default AppBase