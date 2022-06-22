import { BlockchainTx } from './BlockchainTx'

export interface Snapshot {
  id: string
  createdAt: Date
  firstLine: number
  lastLine: number
  logId: string
  fingerprint: string
  transaction: BlockchainTx | null
}
