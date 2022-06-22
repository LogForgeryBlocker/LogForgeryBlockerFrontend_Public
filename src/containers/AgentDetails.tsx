import {
  Button,
  Card,
  FormControlLabel,
  Grid,
  Switch,
  TextField,
  Typography,
} from '@mui/material'
import React, { useCallback, useEffect, useState } from 'react'
import { useParams } from 'react-router'
import { API } from '../services/Api'
import { Agent } from '../types/Agent'

const switchLabel = { inputProps: { 'aria-label': 'Show token' } }

export const AgentDetails: React.FC = () => {
  const { id } = useParams()

  const [agent, setAgent] = useState<Agent | undefined>()
  const [token, setToken] = useState<string | undefined>()
  const [showToken, setShowToken] = useState(false)

  const [minutesInterval, setMinutesInterval] = useState('')
  const [recordsPerSnapshot, setRecordsPerSnapshot] = useState('')

  const [loading, setLoading] = useState(false)

  const fetchAgent = useCallback(() => {
    API.get(`/agent/${id}`)
      .then((res) => {
        const newAgent = res.data.data as Agent
        setAgent(newAgent)

        if (newAgent.config) {
          setMinutesInterval(newAgent.config.snapshotInterval.toString())
          setRecordsPerSnapshot(newAgent.config.maxRecordCount.toString())
        }
      })
      .catch((error) => console.error(error))
  }, [id])

  useEffect(() => {
    fetchAgent()
  }, [id, fetchAgent])

  const fetchToken = () => {
    API.post(`/agent/getToken/${id}`)
      .then((res) => setToken(res.data.data.token))
      .catch(console.error)
  }

  const onTokenSwitchChange = (
    _: React.ChangeEvent<HTMLInputElement>,
    checked: boolean
  ) => {
    setShowToken(checked)

    if (checked && !token) {
      fetchToken()
    }
  }

  const setAgentActive = (active: boolean) => {
    if (agent === undefined) return

    setLoading(true)
    API.put(`/agent/${id}`, { active })
      .then(() => setAgent({ ...agent, active }))
      .catch(console.error)
      .finally(() => setLoading(false))
  }

  const updateAgentConfig = () => {
    if (agent === undefined) return

    if (Number.isNaN(minutesInterval) || Number.isNaN(recordsPerSnapshot))
      return

    setLoading(true)

    const config = {
      maxRecordCount: Number.parseInt(recordsPerSnapshot, 10),
      snapshotInterval: Number.parseInt(minutesInterval, 10),
    }

    API.put(`/agent/config/${agent.config.id}`, config)
      .then((res) => setAgent({ ...agent, config: res.data.data }))
      .catch(console.error)
      .finally(() => setLoading(false))
  }

  return (
    <Grid container spacing={2}>
      <Grid item xs={6}>
        <Card
          sx={{
            height: 300,
            p: 2,
            flexDirection: 'column',
          }}
        >
          <Typography variant="h5" component="h5" sx={{ mb: 2 }}>
            Agent configuration
          </Typography>
          {agent && (
            <>
              <Typography sx={{ mb: 2 }}>
                Agent name: <b>{agent?.name}</b>
              </Typography>
              <Typography sx={{ mb: 2 }}>
                Active: <b>{agent && (agent?.active ? 'YES' : 'NO')}</b>
              </Typography>
              <Button
                variant="contained"
                disabled={loading}
                color={agent.active ? 'error' : 'primary'}
                onClick={() => setAgentActive(!agent.active)}
              >
                {agent.active ? 'Deactivate' : 'Activate'} agent
              </Button>
            </>
          )}
        </Card>
      </Grid>
      <Grid item xs={6}>
        <Card
          sx={{
            p: 2,
            flexDirection: 'column',
            height: 300,
          }}
        >
          <Typography variant="h5" component="h5" sx={{ mb: 2 }}>
            Token
          </Typography>
          <FormControlLabel
            control={
              <Switch
                checked={showToken}
                onChange={onTokenSwitchChange}
                {...switchLabel}
              />
            }
            labelPlacement="end"
            label="Show token"
          />
          <br />
          <TextField
            value={showToken ? token : ''}
            sx={{ width: '100%', mt: 1, mb: 2 }}
            disabled
          />
          <Button variant="contained">Revoke token</Button>
        </Card>
      </Grid>
      <Grid item xs={6}>
        <Card
          sx={{
            flex: 1,
            p: 2,
            flexDirection: 'column',
          }}
        >
          <Typography variant="h5" component="h5" sx={{ mb: 2 }}>
            Logging configuration
          </Typography>
          <TextField
            label="Logging interval in minutes"
            sx={{ width: '100%', mb: 2 }}
            value={minutesInterval}
            onChange={({ target }) => setMinutesInterval(target.value)}
          />
          <TextField
            label="Max records per snapshot"
            sx={{ width: '100%', mb: 2 }}
            value={recordsPerSnapshot}
            onChange={({ target }) => setRecordsPerSnapshot(target.value)}
          />
          <Button variant="contained" onClick={updateAgentConfig}>
            Save
          </Button>
        </Card>
      </Grid>
    </Grid>
  )
}
