import { type Repository } from 'typeorm'
import { type Disciplina } from '../models/disciplina'
export class DisciplinaService {
  constructor(private readonly disciplinaRepository: Repository<Disciplina>) {}

  async create(disciplina: Disciplina): Promise<Disciplina> {
    return await this.disciplinaRepository.save(disciplina)
  }

  async findAllAvailableToMatricula(): Promise<Disciplina[]> {
    const disc = await this.disciplinaRepository.find({
      where: {
        status: 'MATRICULAS',
      },
      relations: ['matriculas'],
    })
    return disc.filter((d) => d.matriculas.length < d.maxAlunos)
  }

  async findOneById(id: string): Promise<Disciplina | null> {
    return await this.disciplinaRepository.findOneBy({ id })
  }

  async findAll(): Promise<Disciplina[]> {
    const disc = await this.disciplinaRepository.find({
      relations: ['matriculas'],
    })
    return disc.map((d) => ({
      ...d,
      matriculasCount: d.matriculas.length,
    }))
  }

  async update(
    id: string,
    updateData: Partial<Disciplina>,
  ): Promise<Disciplina | null> {
    await this.disciplinaRepository.update(id, updateData)
    return await this.findOneById(id)
  }

  async delete(id: string): Promise<void> {
    await this.disciplinaRepository.delete(id)
  }
}
