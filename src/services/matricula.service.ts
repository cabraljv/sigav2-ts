import { type Repository } from 'typeorm'
import { type StatusMatricula, type Matricula } from '../models/matricula'

export class MatriculaService {
  constructor(private readonly matriculaRepository: Repository<Matricula>) {}

  async create(matricula: Matricula): Promise<Matricula> {
    return await this.matriculaRepository.save(matricula)
  }

  async findOneById(id: string, alunoId: string): Promise<Matricula | null> {
    return await this.matriculaRepository.findOne({
      where: {
        id,
        aluno: {
          id: alunoId,
        },
      },
      relations: ['aluno', 'avalicoes'],
    })
  }

  async updateStatus(
    id: string,
    status: StatusMatricula,
  ): Promise<Matricula | null> {
    await this.matriculaRepository.update(id, { status })
    return await this.findOneById(id, '')
  }

  async findAll(): Promise<Matricula[]> {
    return await this.matriculaRepository.find()
  }

  async findOneByIdAndAlunoId(
    id: string,
    alunoId: string,
  ): Promise<Matricula | null> {
    return await this.matriculaRepository.findOneBy({
      id,
      aluno: {
        id: alunoId,
      },
    })
  }

  async findAllByAlunoId(alunoId: string): Promise<Matricula[]> {
    return await this.matriculaRepository.find({
      where: {
        aluno: {
          id: alunoId,
        },
      },
    })
  }

  async delete(id: string): Promise<void> {
    await this.matriculaRepository.delete(id)
  }
}
