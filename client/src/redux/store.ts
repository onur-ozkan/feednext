import { createStore, combineReducers, applyMiddleware } from 'redux'
import thunk, { ThunkMiddleware } from 'redux-thunk'
import { persistStore, persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import { userReducer, settingsReducer, globalReducer } from './Reducers'
import { AppActions } from './Actions'

const persistConfig = {
	key: 'root',
	storage,
}

const rootReducer = combineReducers({
	user: userReducer,
	settings: settingsReducer,
	global: globalReducer
})

const persistedReducer = persistReducer(persistConfig, rootReducer)

type AppState = ReturnType<typeof rootReducer>

const store = createStore(persistedReducer, applyMiddleware(thunk as ThunkMiddleware<AppState, AppActions>))
const persistor = persistStore(store)

export { store, persistor }
