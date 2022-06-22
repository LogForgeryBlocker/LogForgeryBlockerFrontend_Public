import { Box, Fab, Link } from '@mui/material'
import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid'
import { Link as RouterLink } from 'react-router-dom'
import { useEffect, useMemo, useState } from 'react'
import dayjs from 'dayjs'
import AddIcon from '@mui/icons-material/Add'
import { API } from '../services/Api'
import { Agent } from '../types/Agent'
import { NewAgentModal } from '../components/NewAgentModal'

const renderDetailsButton = (params: GridRenderCellParams<any, any>) => (
  <Link component={RouterLink} to={`/admin/agent/${params.row.id}`}>
    Details
  </Link>
)

const columns: GridColDef[] = [
  { field: 'name', headerName: 'Name', flex: 1 },
  { field: 'createdAt', headerName: 'Created at', flex: 1 },
  { field: 'active', headerName: 'Active', flex: 1 },
  { field: 'action', headerName: 'Details', renderCell: renderDetailsButton },
]

export const Admin: React.FC = () => {
  const [agents, setAgents] = useState<Agent[]>([])
  const [showModal, setShowModal] = useState(false)

  const rows = useMemo(
    () =>
      agents.map((agent) => ({
        ...agent,
        createdAt: dayjs(agent.createdAt).format('DD/MM/YYYY HH:mm'),
      })),
    [agents]
  )

  const fetchAgents = () => {
    API.get('/agent')
      .then((res) => setAgents(res.data.data))
      .catch(() => console.log('Could not fetch agents'))
  }

  useEffect(() => {
    fetchAgents()
  }, [])

  return (
    <Box>
      <DataGrid
        columns={columns}
        rows={rows}
        sx={{ height: 600 }}
        disableSelectionOnClick
      />
      <Fab
        variant="extended"
        sx={{ position: 'absolute', right: 40, bottom: 40 }}
        onClick={() => setShowModal(true)}
      >
        <AddIcon sx={{ mr: 1 }} />
        Add
      </Fab>
      <NewAgentModal
        open={showModal}
        onClose={() => setShowModal(false)}
        onAgentAdded={() => {
          setShowModal(false)
          fetchAgents()
        }}
      />
    </Box>
  )
}
