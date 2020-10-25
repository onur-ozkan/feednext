// Other dependencies
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'
import App from 'next/app'
import ReactGA from 'react-ga'
import Router, { useRouter } from 'next/router'
import NProgress from 'nprogress'
import keymachine from 'keymachine'
import 'nprogress/nprogress.css'

// Local files
import { store, persistor } from '@/redux/store'
import { appWithTranslation } from '@/../i18n'
import './global.less'

NProgress.configure({ showSpinner: false })
Router.events.on('routeChangeStart', () => NProgress.start())
Router.events.on('routeChangeComplete', () => NProgress.done())
Router.events.on('routeChangeError', () => NProgress.done())

const AppBase = ({ Component, pageProps }) => {
	const pathname = useRouter().pathname

	if (process.browser) {
		ReactGA.initialize('UA-168030814-1')
		ReactGA.pageview(window.location.pathname + window.location.search)
	}

	return (
		<Provider store={store}>
			<PersistGate loading={<Component {...pageProps} />} persistor={persistor}>
				<Component
					// Following condition is for the not calling useEffect twice on account verification
					{...pathname !== '/auth/sign-up/account-verification' && {
						key: keymachine({ length: 16 })
					}}
					{...pageProps}
				/>
			</PersistGate>
		</Provider>
	)
}

AppBase.getInitialProps = async (appContext) => {
	const appProps = await App.getInitialProps(appContext)
	return { ...appProps }
}

export default appWithTranslation(AppBase)