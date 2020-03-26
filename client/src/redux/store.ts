import { createStore, combineReducers, applyMiddleware } from 'redux'
import thunk, { ThunkMiddleware } from 'redux-thunk'
import { userReducer } from './Reducers/User'
import { AppActions } from './Actions/types'

export const rootReducer = combineReducers({
	user: userReducer,
})

export type AppState = ReturnType<typeof rootReducer>

export const store = createStore(rootReducer, applyMiddleware(thunk as ThunkMiddleware<AppState, AppActions>))
