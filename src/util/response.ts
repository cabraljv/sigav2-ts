import { type Response } from 'express'

export class ResponseReturn {
  constructor(private readonly res: Response) {}

  ok(data?: any): Response {
    return this.res.status(200).json(data)
  }

  created(data?: any): Response {
    return this.res.status(201).json(data)
  }

  badRequest(message: string = 'Bad request'): Response {
    return this.res.status(400).json({ message })
  }

  notFound(message: string = 'Not found'): Response {
    return this.res.status(404).json({ message })
  }

  unauthorized(message: string = 'Unauthorized'): Response {
    return this.res.status(401).json({ message })
  }

  internalServerError(err: Error): Response {
    return this.res
      .status(500)
      .json({ message: 'Internal Server error', stack: err.stack })
  }
}
