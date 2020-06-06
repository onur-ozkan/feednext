// Other dependencies
import thunk, { ThunkMiddleware } from 'redux-thunk'
import { persistStore, persistReducer } from 'redux-persist'
import { createStore, combineReducers, applyMiddleware } from 'redux'
import storage from 'redux-persist/lib/storage'

// Local files
import { userReducer, globalReducer } from './Reducers'
import { AppActions } from './Actions'

const persistConfig = {
	key: 'root',
	storage,
}

const rootReducer = combineReducers({
	user: userReducer,
	global: globalReducer
})

const persistedReducer = persistReducer(persistConfig, rootReducer)

type AppState = ReturnType<typeof rootReducer>

const store = createStore(persistedReducer, applyMiddleware(thunk as ThunkMiddleware<AppState, AppActions>))
const persistor = persistStore(store)

export { store, persistor }
