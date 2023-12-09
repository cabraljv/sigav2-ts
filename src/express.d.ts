// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Express } from 'express'

declare module 'express-serve-static-core' {
  interface Request {
    userId?: string
    kind?: 'aluno' | 'professor' | 'admin'
  }
}
