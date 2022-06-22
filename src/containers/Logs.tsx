import { AxiosResponse } from 'axios'
import { useEffect, useMemo, useState } from 'react'
import { Box, Link } from '@mui/material'
import { Link as RouterLink } from 'react-router-dom'
import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid'
import dayjs from 'dayjs'
import { Log } from '../types/Log'
import { API } from '../services/Api'

const renderDetailsButton = (params: GridRenderCellParams<any, any>) => {
  return (
    <Link component={RouterLink} to={`/log/${params.row.id}`}>
      Details
    </Link>
  )
}

const columns: GridColDef[] = [
  { field: 'name', headerName: 'Name', flex: 1 },
  { field: 'records', headerName: 'Records' },
  { field: 'agentName', headerName: 'Agent' },
  { field: 'createdAt', headerName: 'Created At', flex: 0.3 },
  {
    field: 'action',
    headerName: 'Snapshots',
    renderCell: renderDetailsButton,
  },
  { field: 'verified', headerName: 'Valid' },
]

const Logs = () => {
  const [response, setResponse] = useState<AxiosResponse | undefined>(undefined)
  const [logs, setLogs] = useState<Log[]>([])

  const rows = useMemo(
    () =>
      logs.map((log) => {
        const verifications = log?.logVerification ?? []
        const verification = verifications.pop()
        const verified = verification?.isCorrect ? 'yes' : 'no'

        return {
          id: log.id,
          name: log.name,
          records: log.records,
          createdAt: dayjs(log.createdAt).format('DD/MM/YYYY HH:mm'),
          organizationId: log.organizationId,
          agentName: log.agent.name,
          verified,
        }
      }),
    [logs]
  )

  useEffect(() => {
    API.get(`/log`)
      .then((res) => setResponse(res))
      .catch((e) => {
        console.error(e)
      })
  }, [])

  useEffect(() => {
    if (!response) {
      return
    }
    if (response?.status === 200) {
      setLogs(response?.data?.data)
    }
  }, [response])

  return (
    <Box>
      <DataGrid
        columns={columns}
        rows={rows}
        sx={{ height: 600 }}
        disableSelectionOnClick
      />
    </Box>
  )
}

export default Logs
