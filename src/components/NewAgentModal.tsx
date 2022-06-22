import {
  Box,
  Button,
  Card,
  Modal,
  Stack,
  TextField,
  Typography,
} from '@mui/material'
import { useState } from 'react'
import { API } from '../services/Api'

interface Props {
  open: boolean
  onClose: () => void
  onAgentAdded: () => void
}

export const NewAgentModal: React.FC<Props> = ({
  open,
  onClose,
  onAgentAdded,
}) => {
  const [name, setName] = useState('')

  const [loading, setLoading] = useState(false)

  const createAgent = () => {
    setLoading(true)
    API.post('/agent', { name })
      .then(onAgentAdded)
      .catch(console.error)
      .finally(() => setLoading(false))
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      sx={{
        position: 'absolute',
        display: 'flex',
        width: '100%',
        height: '100%',
        backgroundColor: '#00000088',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Card sx={{ width: 400, p: 2 }}>
        <Stack spacing={2}>
          <Typography variant="h5" component="h5">
            Create agent
          </Typography>
          <Box sx={{ flex: 1 }} />
          <TextField
            value={name}
            label="name"
            onChange={({ target }) => setName(target.value)}
          />
          <Button disabled={loading} variant="contained" onClick={createAgent}>
            Create
          </Button>
        </Stack>
      </Card>
    </Modal>
  )
}
