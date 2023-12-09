import {
  BeforeInsert,
  Column,
  Entity,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm'
import { Professor } from './professor'
import { Aluno } from './aluno'
import bcrypt from 'bcrypt'

import { Admin } from './admin'
@Entity()
export class Credencial {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({
    type: 'varchar',
  })
  email: string

  @Column({
    type: 'varchar',
  })
  senha: string

  @OneToOne(() => Aluno, (aluno) => aluno.credencial)
  aluno: Aluno

  @OneToOne(() => Professor, (professor) => professor.credencial)
  professor: Professor

  @OneToOne(() => Admin, (admin) => admin.credencial)
  admin: Admin

  async validatePassword(password: string): Promise<boolean> {
    return await bcrypt.compare(password, this.senha)
  }

  async hashPassword(password: string): Promise<void> {
    this.senha = await bcrypt.hash(password, 10)
  }

  @BeforeInsert()
  async encryptPassword(): Promise<void> {
    if (this.senha) {
      const salt = await bcrypt.genSalt()
      this.senha = await bcrypt.hash(this.senha, salt)
    }
  }
}
