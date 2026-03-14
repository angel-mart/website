import { useContext } from 'react'
import { AppContext } from './AppContext.js'

export const useApp = () => useContext(AppContext)
