import { Box, Container, CssBaseline, Toolbar, useTheme } from '@mui/material'
import { ReactNode } from 'react'
import { Header } from '../components/Header'

interface WrapperProps {
  children: ReactNode
}

const Wrapper = ({ children }: WrapperProps) => {
  const { palette } = useTheme()

  return (
    <Box sx={{ display: 'flex', backgroundColor: 'blue' }}>
      <CssBaseline />
      <Header />
      <Box
        sx={{
          flexGrow: 1,
          height: '100vh',
          overflow: 'auto',
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: palette.background.default,
        }}
      >
        <Toolbar />
        <Container
          maxWidth="lg"
          sx={{
            mt: 4,
            mb: 4,
            height: '100%',
          }}
        >
          {children}
        </Container>
      </Box>
    </Box>
  )
}

export default Wrapper
