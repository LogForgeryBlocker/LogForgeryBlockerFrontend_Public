import React, { useContext } from 'react'
import { BrowserRouter, Routes, Navigate } from 'react-router-dom'
import { Route } from 'react-router'
import { createTheme, ThemeProvider } from '@mui/material'

import Login from '../containers/Login'
import Register from '../containers/Register'
import Logs from '../containers/Logs'
import LogDetails from '../containers/LogDetails'
import Wrapper from './Wrapper'
import { AuthContext, AuthProvider } from './Auth'
import { Admin } from '../containers/Admin'
import { AgentDetails } from '../containers/AgentDetails'

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
})

const ProtectedRoute = ({
  element,
  admin = false,
}: {
  element: JSX.Element
  admin?: boolean
}) => {
  const { authState } = useContext(AuthContext)

  const showProtected =
    authState && (!admin || authState.user.roles.includes('ADMIN'))

  return showProtected ? element : <Navigate to="/login" replace />
}

export const Root = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ThemeProvider theme={darkTheme}>
          <Wrapper>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route
                path="/"
                element={<ProtectedRoute element={<Navigate to="/logs" />} />}
              />
              <Route
                path="/logs"
                element={<ProtectedRoute element={<Logs />} />}
              />
              <Route
                path="/log/:id"
                element={<ProtectedRoute element={<LogDetails />} />}
              />
              <Route
                path="/admin/"
                element={<ProtectedRoute admin element={<Admin />} />}
              />
              <Route
                path="/admin/agent/:id"
                element={<ProtectedRoute admin element={<AgentDetails />} />}
              />
            </Routes>
          </Wrapper>
        </ThemeProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}
