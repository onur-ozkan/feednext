// Other dependencies
import React from 'react'

const StepContext: any = React.createContext({})

export const StepProvider = StepContext.Provider
export const StepConsumer = StepContext.Consumer

export default StepContext
