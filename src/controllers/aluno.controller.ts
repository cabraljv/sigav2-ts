import { type Request, type Response, Router } from 'express'
import { type AlunoService } from '../services/aluno.service'
import { type Aluno } from '../models/aluno'
import { ResponseReturn } from '../util/response'

export class AlunoController {
  public router: Router
  private readonly alunoService: AlunoService

  constructor(alunoService: AlunoService) {
    this.alunoService = alunoService
    this.router = Router()
    this.routes()
  }

  public async getAll(req: Request, res: Response): Promise<Response> {
    try {
      const alunos = await this.alunoService.findAll()
      return new ResponseReturn(res).ok(alunos)
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
      const aluno = await this.alunoService.findOneById(req.params.id)
      if (aluno) {
        return new ResponseReturn(res).ok(aluno)
      } else {
        return new ResponseReturn(res).notFound('Aluno not found')
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
    if (req.kind !== 'admin') return new ResponseReturn(res).unauthorized()
    try {
      const newAluno = await this.alunoService.create(req.body as Aluno)
      return new ResponseReturn(res).created(newAluno)
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
    if (req.kind !== 'admin') return new ResponseReturn(res).unauthorized()
    try {
      const updatedAluno = await this.alunoService.update(
        req.params.id,
        req.body,
      )
      return new ResponseReturn(res).ok(updatedAluno)
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
    if (req.kind !== 'admin') return new ResponseReturn(res).unauthorized()
    try {
      await this.alunoService.delete(req.params.id)
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
