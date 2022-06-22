import styled from 'styled-components'
import React, { useContext, useCallback } from 'react'
import { AppBar, Box, Button, Link, Toolbar } from '@mui/material'
import { Link as RouterLink } from 'react-router-dom'
import { AuthContext } from '../wrappers/Auth'

export const HeaderButton = styled(Button).attrs({ color: 'inherit' })``

const linkSX = { textDecoration: 'none', color: 'white' }

export const Header = () => {
  const { authState, setAuthState } = useContext(AuthContext)

  const logout = useCallback(() => {
    setAuthState(undefined)
    window.location.replace('/')
  }, [setAuthState])

  const isAdmin = authState && authState.user.roles.includes('ADMIN')

  return (
    <AppBar position="absolute">
      <Toolbar color="inherit">
        <Box sx={{ flexGrow: 1 }}>
          {authState ? (
            <>
              <Link component={RouterLink} to="/logs" sx={linkSX}>
                <HeaderButton>Logs</HeaderButton>
              </Link>
              {isAdmin && (
                <Link component={RouterLink} to="/admin" sx={linkSX}>
                  <HeaderButton>Admin panel</HeaderButton>
                </Link>
              )}
            </>
          ) : (
            <>
              <Link component={RouterLink} to="/login" sx={linkSX}>
                <HeaderButton>Login</HeaderButton>
              </Link>
              <Link component={RouterLink} to="/register" sx={linkSX}>
                <HeaderButton>Register</HeaderButton>
              </Link>
            </>
          )}
        </Box>
        {authState && <HeaderButton onClick={logout}>Logout</HeaderButton>}
      </Toolbar>
    </AppBar>
  )
}
