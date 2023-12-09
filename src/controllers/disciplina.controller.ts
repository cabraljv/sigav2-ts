import { type Request, type Response, Router } from 'express'
import { type DisciplinaService } from '../services/disciplina.service'
import { type Disciplina } from '../models/disciplina'
import { ResponseReturn } from '../util/response'

export class DisciplinaController {
  public router: Router
  private readonly disciplinaService: DisciplinaService

  constructor(disciplinaService: DisciplinaService) {
    this.disciplinaService = disciplinaService
    this.router = Router()
    this.routes()
  }

  public async getAll(req: Request, res: Response): Promise<Response> {
    try {
      if (req.kind === 'aluno') {
        const disciplinas =
          await this.disciplinaService.findAllAvailableToMatricula()
        return new ResponseReturn(res).ok(disciplinas)
      }
      const disciplinas = await this.disciplinaService.findAll()
      return new ResponseReturn(res).ok(disciplinas)
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
      const disciplina = await this.disciplinaService.findOneById(req.params.id)
      if (disciplina) {
        return new ResponseReturn(res).ok(disciplina)
      } else {
        return new ResponseReturn(res).notFound('Disciplina not found')
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
      const newDisciplina = await this.disciplinaService.create(
        req.body as Disciplina,
      )
      return new ResponseReturn(res).created(newDisciplina)
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
      const updatedDisciplina = await this.disciplinaService.update(
        req.params.id,
        req.body,
      )
      return new ResponseReturn(res).ok(updatedDisciplina)
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
      await this.disciplinaService.delete(req.params.id)
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
