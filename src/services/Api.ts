import axios from 'axios'
import { DATABASE_ADDRESS } from '../constants'

export const API = axios.create({
  baseURL: DATABASE_ADDRESS,
})
