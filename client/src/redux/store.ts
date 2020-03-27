import { createStore, combineReducers, applyMiddleware } from 'redux'
import thunk, { ThunkMiddleware } from 'redux-thunk'
import { userReducer, settingsReducer } from './Reducers'
import { AppActions } from './Actions/types'

export const rootReducer = combineReducers({
	user: userReducer,
	settings: settingsReducer,
})

export type AppState = ReturnType<typeof rootReducer>

export const store = createStore(rootReducer, applyMiddleware(thunk as ThunkMiddleware<AppState, AppActions>))
