import { type Repository } from 'typeorm'
import { type Credencial } from '../models/credencial'

export class CredencialService {
  constructor(private readonly credentialRepository: Repository<Credencial>) {}

  async create(credential: Credencial): Promise<Credencial> {
    return await this.credentialRepository.save(credential)
  }

  async findOneByEmail(email: string): Promise<Credencial | null> {
    return await this.credentialRepository.findOne({ where: { email } })
  }
}
