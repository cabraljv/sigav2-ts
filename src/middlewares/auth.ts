import { type Request, type Response, type NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import { type CredencialService } from '../services/credencial.service'

const SECRET_KEY = 'suaChaveSecreta' // Mantenha esta chave segura

type UserTypes = 'aluno' | 'professor' | 'admin'
export class AuthenticationMiddleware {
  constructor(private readonly credentialService: CredencialService) {}

  async authenticate(
    req: Request,
    res: Response,
    next: NextFunction,
    // eslint-disable-next-line @typescript-eslint/no-invalid-void-type
  ): Promise<void | Response<any, Record<string, any>>> {
    try {
      const { email, password } = req.body
      const credential = await this.credentialService.findOneByEmail(email)

      if (!credential) {
        return res.status(401).json({ message: 'Usuário não encontrado' })
      }

      const isMatch = await credential.validatePassword(password)

      if (!isMatch) {
        return res.status(401).json({ message: 'Senha inválida' })
      }

      let kind: UserTypes = 'aluno'
      if (credential.admin) {
        kind = 'admin'
      }
      if (credential.professor) {
        kind = 'professor'
      }

      const token = jwt.sign(
        { userId: credential[kind].id, kind },
        SECRET_KEY,
        {
          expiresIn: '24h',
        },
      )

      res.json({ token })
    } catch (error) {
      next(error)
    }
  }

  async authorize(
    req: Request,
    res: Response,
    next: NextFunction,
    // eslint-disable-next-line @typescript-eslint/no-invalid-void-type
  ): Promise<void | Response<any, Record<string, any>>> {
    try {
      const token = req.headers.authorization?.split(' ')[1]

      if (!token) {
        return res.status(401).json({ message: 'Não autorizado' })
      }

      const payload: any = jwt.verify(token, SECRET_KEY)

      if (!payload) {
        return res.status(401).json({ message: 'Não autorizado' })
      }

      req.userId = payload?.userId || ''
      req.kind = payload?.kind || ''

      next()
    } catch (error) {
      next(error)
    }
  }
}
