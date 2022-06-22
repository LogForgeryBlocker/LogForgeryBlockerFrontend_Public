import { Box, Card, Link, Typography } from '@mui/material'
import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid'
import dayjs from 'dayjs'
import { useEffect, useMemo, useState } from 'react'
import { Link as RouterLink, useParams } from 'react-router-dom'
import { API } from '../services/Api'
import { Log } from '../types/Log'
import { Snapshot } from '../types/Snapshot'

const getEtherscanLink = (txHash: string) =>
  `https://ropsten.etherscan.io/tx/${txHash}`

const renderTransactionButton = (params: GridRenderCellParams<any, any>) => {
  return params.row.transaction ? (
    <Link
      href={getEtherscanLink(params.row.transaction)}
      target="_blank"
      rel="noopener noreferrer"
    >
      {`0x${params.row.transaction.substr(0, 6)}...`}
    </Link>
  ) : null
}

const columns: GridColDef[] = [
  { field: 'firstLine', headerName: 'First line', width: 100 },
  { field: 'lastLine', headerName: 'Last line', width: 100 },
  { field: 'createdAt', headerName: 'Created At', flex: 0.3 },
  { field: 'fingerprint', headerName: 'Fingerprint', flex: 1 },
  {
    field: 'transaction',
    headerName: 'Transaction',
    renderCell: renderTransactionButton,
  },
]

const LogDetails = () => {
  const { id } = useParams()
  const [, setError] = useState<string | undefined>(undefined)
  const [snapshots, setSnapshots] = useState<Snapshot[]>([])
  const [log, setLog] = useState<Log | undefined>(undefined)

  useEffect(() => {
    API.get(`/snapshot/for_log/${id}`)
      .then((res) => setSnapshots(res.data.data))
      .catch(() => {
        setError('Error while catching log, refresh page or contact support!')
      })

    API.get(`/log/${id}`)
      .then((res) => setLog(res.data.data))
      .catch(() => {
        setError('Error while catching log, refresh page or contact support!')
      })
  }, [id])

  const rows = useMemo(
    () =>
      snapshots.map((snapshot) => ({
        id: snapshot.id,
        firstLine: snapshot.firstLine,
        lastLine: snapshot.lastLine,
        createdAt: dayjs(snapshot.createdAt).format('DD/MM/YYYY HH:mm'),
        fingerprint: snapshot.fingerprint,
        transaction: snapshot.transaction?.txHash ?? null,
      })),
    [snapshots]
  )

  return (
    <Box>
      <Card sx={{ mb: 4, p: 2 }}>
        <Link component={RouterLink} to="/logs">
          Go back
        </Link>
        <Typography>
          Name: <b>{log?.name}</b>
        </Typography>
        <Typography>
          agent: <b>{log?.agent.name}</b>
        </Typography>
      </Card>
      <DataGrid
        columns={columns}
        rows={rows}
        sx={{ height: 500 }}
        disableSelectionOnClick
      />
    </Box>
  )
}

export default LogDetails
