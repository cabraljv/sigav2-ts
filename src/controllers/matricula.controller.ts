import { type Request, type Response, Router } from 'express'
import { type MatriculaService } from '../services/matricula.service'
import { type Matricula } from '../models/matricula'
import { ResponseReturn } from '../util/response'

export class MatriculaController {
  public router: Router
  private readonly matriculaService: MatriculaService

  constructor(matriculaService: MatriculaService) {
    this.matriculaService = matriculaService
    this.router = Router()
    this.routes()
  }

  public async getAll(req: Request, res: Response): Promise<Response> {
    try {
      if (req.kind !== 'aluno') {
        return new ResponseReturn(res).unauthorized()
      }
      const matriculas = await this.matriculaService.findAllByAlunoId(
        req?.userId ?? '',
      )
      return new ResponseReturn(res).ok(matriculas)
    } catch (error) {
      if (error instanceof Error) {
        return new ResponseReturn(res).internalServerError(error)
      }
      return new ResponseReturn(res).internalServerError(
        new Error('Internal server error'),
      )
    }
  }

  public async getOne(req: Request, res: Response): Promise<Response> {
    try {
      if (req.kind !== 'aluno') {
        return new ResponseReturn(res).unauthorized()
      }

      const matricula = await this.matriculaService.findOneByIdAndAlunoId(
        req.params.id,
        req?.userId ?? '',
      )
      if (matricula) {
        return new ResponseReturn(res).ok(matricula)
      } else {
        return new ResponseReturn(res).notFound('Matricula not found')
      }
    } catch (error) {
      if (error instanceof Error) {
        return new ResponseReturn(res).internalServerError(error)
      }
      return new ResponseReturn(res).internalServerError(
        new Error('Internal server error'),
      )
    }
  }

  public async create(req: Request, res: Response): Promise<Response> {
    try {
      const newMatricula = await this.matriculaService.create(
        req.body as Matricula,
      )
      return new ResponseReturn(res).created(newMatricula)
    } catch (error) {
      if (error instanceof Error) {
        return new ResponseReturn(res).internalServerError(error)
      }
      return new ResponseReturn(res).internalServerError(
        new Error('Internal server error'),
      )
    }
  }

  public async update(req: Request, res: Response): Promise<Response> {
    try {
      if (req.kind === 'aluno') {
        const matricula = await this.matriculaService.findOneByIdAndAlunoId(
          req.params.id,
          req?.userId ?? '',
        )

        if (!matricula) {
          return new ResponseReturn(res).notFound('Matricula not found')
        }

        if (matricula.status !== 'EM_ANDAMENTO') {
          return new ResponseReturn(res).unauthorized()
        }
        const updatedMatricula = await this.matriculaService.updateStatus(
          req.params.id,
          'TRANCADA',
        )
        return new ResponseReturn(res).ok(updatedMatricula)
      }

      const updatedMatricula = await this.matriculaService.updateStatus(
        req.params.id,
        req.body.status,
      )
      return new ResponseReturn(res).ok(updatedMatricula)
    } catch (error) {
      if (error instanceof Error) {
        return new ResponseReturn(res).internalServerError(error)
      }
      return new ResponseReturn(res).internalServerError(
        new Error('Internal server error'),
      )
    }
  }

  public async delete(req: Request, res: Response): Promise<Response> {
    try {
      await this.matriculaService.delete(req.params.id)
      return new ResponseReturn(res).ok()
    } catch (error) {
      if (error instanceof Error) {
        return new ResponseReturn(res).internalServerError(error)
      }
      return new ResponseReturn(res).internalServerError(
        new Error('Internal server error'),
      )
    }
  }

  private routes(): void {
    this.router.get('/', this.getAll.bind(this))
    this.router.get('/:id', this.getOne.bind(this))
    this.router.post('/', this.create.bind(this))
    this.router.put('/:id', this.update.bind(this))
    this.router.delete('/:id', this.delete.bind(this))
  }
}
