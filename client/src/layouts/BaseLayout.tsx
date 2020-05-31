// Other dependencies
import React from 'react'
import ReactGA from 'react-ga'
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'

// Local files
import { store, persistor } from '@/redux/store'

const BaseLayout: React.FC = ({ isServer, children }) => {
	if (!!!isServer) {
		ReactGA.initialize('UA-168030814-1')
		ReactGA.pageview(window.location.pathname + window.location.search)
	}

	return (
		<Provider store={store}>
			<PersistGate loading={null} persistor={persistor}>
				{children}
			</PersistGate>
		</Provider>
	)
}

BaseLayout.getInitialProps = async ({ isServer }: { isServer: boolean }) => {
	return { isServer }
}

export default BaseLayout
