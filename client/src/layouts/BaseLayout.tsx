// Other dependencies
import React from 'react'
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'

// Local files
import { store, persistor } from '@/redux/store'

const BaseLayout: React.FC = ({ children }) => (
	<Provider store={store}>
		<PersistGate loading={null} persistor={persistor}>
			{children}
		</PersistGate>
	</Provider>
)

export default BaseLayout
