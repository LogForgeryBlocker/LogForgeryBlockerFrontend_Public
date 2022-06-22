import { Agent } from './Agent'

export interface LogVerification {
  id: string
  createdAt: Date
  logId: string
  isCorrect: boolean
}

export interface Log {
  id: string
  organizationId: string
  name: string
  records: number
  createdAt: Date
  agent: Agent
  disableButton?: boolean
  logVerification?: LogVerification[]
}
