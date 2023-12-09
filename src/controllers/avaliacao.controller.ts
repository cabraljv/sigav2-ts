import { type Request, type Response, Router } from 'express'
import { type AvaliacaoService } from '../services/avaliacao.service'
import { type Avaliacao } from '../models/avaliacao'
import { ResponseReturn } from '../util/response'
import { type MatriculaService } from '../services/matricula.service'

export class AvaliacaoController {
  public router: Router
  private readonly avaliacaoService: AvaliacaoService
  private readonly matriculaService: MatriculaService

  constructor(
    avaliacaoService: AvaliacaoService,
    matriculaService: MatriculaService,
  ) {
    this.avaliacaoService = avaliacaoService
    this.matriculaService = matriculaService
    this.router = Router()
    this.routes()
  }

  public async getOne(req: Request, res: Response): Promise<Response> {
    try {
      if (req.kind === 'aluno') {
        const matricula = await this.matriculaService.findOneByIdAndAlunoId(
          req.params.matriculaId,
          req?.userId ?? '',
        )

        if (!matricula) {
          return new ResponseReturn(res).notFound('Matricula not found')
        }
      }
      const avaliacao = await this.avaliacaoService.findAllByMatricula(
        req.params.matriculaId,
      )
      if (avaliacao) {
        return new ResponseReturn(res).ok(avaliacao)
      } else {
        return new ResponseReturn(res).notFound('Avaliacao not found')
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
    if (req.kind !== 'professor') return new ResponseReturn(res).unauthorized()
    try {
      const newAvaliacao = await this.avaliacaoService.create(
        req.body as Avaliacao,
      )
      return new ResponseReturn(res).created(newAvaliacao)
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
      const updatedAvaliacao = await this.avaliacaoService.update(
        req.params.id,
        req.body,
      )
      return new ResponseReturn(res).ok(updatedAvaliacao)
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
      await this.avaliacaoService.delete(req.params.id)
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
    this.router.get('/:matriculaId', this.getOne.bind(this))
    this.router.post('/', this.create.bind(this))
    this.router.put('/:id', this.update.bind(this))
    this.router.delete('/:id', this.delete.bind(this))
  }
}
