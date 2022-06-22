import axios from 'axios'
import { useState, useContext } from 'react'
import { Box, Button, Card, TextField } from '@mui/material'
import { DATABASE_ADDRESS } from '../constants'
import { AuthContext } from '../wrappers/Auth'
import { ErrorLabel } from '../components/ErrorLabel'

const Login = () => {
  const [login, setLogin] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | undefined>(undefined)
  const [active, setActive] = useState<string | undefined>(undefined)

  const { setAuthState } = useContext(AuthContext)

  function handleSubmit() {
    const body = {
      username: login,
      password,
    }
    axios
      .post(`${DATABASE_ADDRESS}/auth/login`, body)
      .then((res) => setAuthState(res.data.data))
      .then(() => window.location.replace('/'))
      .catch(() => {
        setError('Incorrect login or password, try again!')
      })
  }

  const areEmpty = login === '' || password === ''

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
        <TextField
          id="password"
          label="Password"
          variant="outlined"
          type="password"
          value={password}
          onSubmit={() => setActive(undefined)}
          onChange={(event) => {
            setPassword(event.target.value)
            setActive('password')
          }}
          sx={{ mb: 2, width: 300 }}
        />
        {error && <ErrorLabel>{error}</ErrorLabel>}
        <Button
          variant="contained"
          disabled={areEmpty}
          onClick={() => handleSubmit()}
          sx={{ width: 300 }}
        >
          Login
        </Button>
      </Card>
    </Box>
  )
}

export default Login
