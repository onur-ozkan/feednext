// Other dependencies
import { createStore, combineReducers, applyMiddleware } from 'redux'
import { persistReducer, persistStore } from 'redux-persist'
import { createWrapper } from 'next-redux-wrapper'
import { composeWithDevTools } from 'redux-devtools-extension'
import thunkMiddleware from 'redux-thunk'

// Local files
import { userReducer, globalReducer } from './Reducers'

const rootReducer = combineReducers({
	user: userReducer,
	global: globalReducer
})

// BINDING MIDDLEWARE
const bindMiddleware = (middleware) => {
	if (process.env.NODE_ENV !== 'production') {
		return composeWithDevTools(applyMiddleware(...middleware))
	}
	return applyMiddleware(...middleware)
}


const makeStore = ({ isServer }) => {
	if (isServer) {
		//If it's on server side, create a store simply
		return createStore(rootReducer, bindMiddleware([thunkMiddleware]))
	} else {
		//If it's on client side, create a store with a persistability feature
		const storage = require('redux-persist/lib/storage').default

		const persistConfig = {
			key: 'root',
			storage,
		}

		const persistedReducer = persistReducer(persistConfig, rootReducer)
		const store = createStore(
			persistedReducer,
			bindMiddleware([thunkMiddleware])
		)
		store.__persistor = persistStore(store)
		return store
	}
}

export const wrapper = createWrapper(makeStore)