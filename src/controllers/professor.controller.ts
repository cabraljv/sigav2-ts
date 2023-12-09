import { type Request, type Response, Router } from 'express'
import { type ProfessorService } from '../services/professor.service'
import { type Professor } from '../models/professor'
import { ResponseReturn } from '../util/response'

export class ProfessorController {
  public router: Router
  private readonly professorService: ProfessorService

  constructor(professorService: ProfessorService) {
    this.professorService = professorService
    this.router = Router()
    this.routes()
  }

  public async getAll(req: Request, res: Response): Promise<Response> {
    try {
      const professors = await this.professorService.findAll()
      return new ResponseReturn(res).ok(professors)
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
      const professor = await this.professorService.findOneById(req.params.id)
      if (professor) {
        return new ResponseReturn(res).ok(professor)
      } else {
        return new ResponseReturn(res).notFound('Professor not found')
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
      const newProfessor = await this.professorService.create(
        req.body as Professor,
      )
      return new ResponseReturn(res).created(newProfessor)
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
      const updatedProfessor = await this.professorService.update(
        req.params.id,
        req.body,
      )
      res.send(updatedProfessor)
      return res.status(200).send(updatedProfessor)
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
      await this.professorService.delete(req.params.id)
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
