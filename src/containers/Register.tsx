import { Box, Button, Card, TextField } from '@mui/material'
import axios from 'axios'
import { useState, useContext } from 'react'
import { AuthContext } from '../wrappers/Auth'
import { DATABASE_ADDRESS } from '../constants'
import { ErrorLabel } from '../components/ErrorLabel'

const Register = () => {
  const [login, setLogin] = useState('')
  const [password, setPassword] = useState('')
  const [passwordAgain, setPasswordAgain] = useState('')
  const [error, setError] = useState<string | undefined>(undefined)
  const [active, setActive] = useState<string | undefined>(undefined)

  const { setAuthState } = useContext(AuthContext)

  function handleSubmit() {
    const body = {
      username: login,
      password,
    }
    axios
      .post(`${DATABASE_ADDRESS}/auth/register`, body)
      .then((res) => setAuthState(res.data.data))
      .then(() => window.location.replace('/'))
      .catch(() => {
        setError('Error while registering, try again!')
      })
  }

  const areEmpty = login === '' || password === '' || passwordAgain === ''

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100%',
      }}
    >
      <Card
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          p: 4,
        }}
      >
        {error}
        <TextField
          id="login"
          label="Login"
          variant="outlined"
          value={login}
          onChange={(event) => {
            setLogin(event.target.value)
            setActive('login')
          }}
          sx={{ mb: 2, width: 300 }}
        />
        {active !== 'login' && !!active && login === '' ? (
          <ErrorLabel>Login cannot be empty!</ErrorLabel>
        ) : null}
        <TextField
          id="password"
          label="Password"
          variant="outlined"
          type="password"
          value={password}
          onChange={(event) => {
            setPassword(event.target.value)
            setActive('password')
          }}
          sx={{ mb: 2, width: 300 }}
        />
        {active !== 'password' && !areEmpty && password.length < 8 ? (
          <ErrorLabel>Password must have at least 8 characters</ErrorLabel>
        ) : null}
        <TextField
          id="confirm-password"
          label="Confirm password"
          variant="outlined"
          type="password"
          value={passwordAgain}
          onSubmit={() => setActive(undefined)}
          onChange={(event) => {
            setPasswordAgain(event.target.value)
            setActive('passwordAgain')
          }}
          sx={{ mb: 2, width: 300 }}
        />
        {!areEmpty && password !== passwordAgain ? (
          <ErrorLabel>Passwords must be equal</ErrorLabel>
        ) : null}
        <Button
          variant="contained"
          disabled={areEmpty}
          onClick={() => handleSubmit()}
          sx={{ width: 300 }}
        >
          Register
        </Button>
      </Card>
    </Box>
  )
}

export default Register
