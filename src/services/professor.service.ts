import { type Repository } from 'typeorm'
import { type Professor } from '../models/professor'

export class ProfessorService {
  constructor(private readonly professorRepository: Repository<Professor>) {}

  async create(professor: Professor): Promise<Professor> {
    return await this.professorRepository.save(professor)
  }

  async findOneById(id: string): Promise<Professor | null> {
    return await this.professorRepository.findOneBy({ id })
  }

  async findAll(): Promise<Professor[]> {
    return await this.professorRepository.find()
  }

  async update(
    id: string,
    updateData: Partial<Professor>,
  ): Promise<Professor | null> {
    await this.professorRepository.update(id, updateData)
    return await this.findOneById(id)
  }

  async delete(id: string): Promise<void> {
    await this.professorRepository.delete(id)
  }
}
