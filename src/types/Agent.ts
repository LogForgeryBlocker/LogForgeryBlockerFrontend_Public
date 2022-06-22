export interface Agent {
  id: string
  createdAt: Date
  name: string
  active: boolean
  organizationId: string
  config: {
    id: string
    agentId: string
    maxRecordCount: 100
    snapshotInterval: 60
  }
}
