import { type Repository } from 'typeorm'
import { type Avaliacao } from '../models/avaliacao'

export class AvaliacaoService {
  constructor(private readonly avaliacaoRepository: Repository<Avaliacao>) {}

  async create(avaliacao: Avaliacao): Promise<Avaliacao> {
    return await this.avaliacaoRepository.save(avaliacao)
  }

  async findOneById(id: string): Promise<Avaliacao | null> {
    return await this.avaliacaoRepository.findOneBy({ id })
  }

  public async findAllByMatricula(matriculaId: string): Promise<Avaliacao[]> {
    return await this.avaliacaoRepository.find({
      where: {
        matricula: {
          id: matriculaId,
        },
      },
      relations: ['matricula'],
    })
  }

  async findAll(): Promise<Avaliacao[]> {
    return await this.avaliacaoRepository.find()
  }

  async update(
    id: string,
    updateData: Partial<Avaliacao>,
  ): Promise<Avaliacao | null> {
    await this.avaliacaoRepository.update(id, updateData)
    return await this.findOneById(id)
  }

  async delete(id: string): Promise<void> {
    await this.avaliacaoRepository.delete(id)
  }
}
