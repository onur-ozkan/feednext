import { wrapper } from '../redux/store'
import App from 'next/app'
import ReactGA from 'react-ga'
import '@/styles/antd/global.less'

const AppBase = ({ Component, pageProps }) => {
	if (process.browser) {
		ReactGA.initialize('UA-168030814-1')
		ReactGA.pageview(window.location.pathname + window.location.search)
	}

	return <Component {...pageProps} />
}

AppBase.getInitialProps = async (appContext) => {
	const appProps = await App.getInitialProps(appContext)
	return { ...appProps }
}

export default wrapper.withRedux(AppBase)