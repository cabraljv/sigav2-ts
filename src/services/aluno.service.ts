import { type Repository } from 'typeorm'
import { type Aluno } from '../models/aluno'

export class AlunoService {
  constructor(private readonly alunoRepository: Repository<Aluno>) {}

  async create(aluno: Aluno): Promise<Aluno> {
    return await this.alunoRepository.save(aluno)
  }

  async findOneById(id: string): Promise<Aluno | null> {
    return await this.alunoRepository.findOneBy({ id })
  }

  async findAll(): Promise<Aluno[]> {
    return await this.alunoRepository.find()
  }

  async update(id: string, updateData: Partial<Aluno>): Promise<Aluno | null> {
    await this.alunoRepository.update(id, updateData)
    return await this.findOneById(id)
  }

  async delete(id: string): Promise<void> {
    await this.alunoRepository.delete(id)
  }
}
