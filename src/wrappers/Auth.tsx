import React, { useEffect } from 'react'
import { noop } from 'lodash'
import { API } from '../services/Api'

export type Role = 'USER' | 'ADMIN'

export type AuthData = {
  user: {
    id: string
    username: string
    organizationId: string
    roles: Role[]
  }
  token: string
}

type AuthContextType = {
  authState: AuthData | undefined
  setAuthState: React.Dispatch<React.SetStateAction<AuthData | undefined>>
}

export const AuthContext = React.createContext<AuthContextType>({
  authState: undefined,
  setAuthState: noop,
})

const getAuthStateFromToken = (): AuthData | undefined => {
  const authDataString = localStorage.getItem('authData')

  if (authDataString) {
    try {
      const authData = JSON.parse(authDataString) as AuthData
      return authData
    } catch (e) {
      console.error(e)
    }
  }
  return undefined
}

export const AuthProvider: React.FC = ({ children }) => {
  const [authState, setAuthState] = React.useState<AuthData | undefined>(
    getAuthStateFromToken()
  )

  useEffect(() => {
    // After page refresh, load persisted authData from local storage.
    const authDataString = localStorage.getItem('authData')

    if (authDataString) {
      try {
        const authData = JSON.parse(authDataString) as AuthData
        setAuthState(authData)
      } catch (e) {
        console.error(e)
      }
    }
  }, [])

  useEffect(() => {
    if (authState) {
      localStorage.setItem('authData', JSON.stringify(authState))
    } else {
      localStorage.removeItem('authData')
    }
  }, [authState])

  const value = React.useMemo(
    () => ({ authState, setAuthState }),
    [authState, setAuthState]
  )

  // Add authorization header to axios instance
  React.useMemo(() => {
    API.interceptors.request.use((config) => {
      if (config) {
        config.headers = config.headers ?? {}

        config.headers.Authorization = authState
          ? `Bearer ${authState.token}`
          : ''
      }

      return config
    })
  }, [authState])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
