import { UserActions } from './User/types'
import { SettingsActions } from './Settings/types'

export type AppActions = UserActions | SettingsActions
