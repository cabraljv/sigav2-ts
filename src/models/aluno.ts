import {
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm'
import { Credencial } from './credencial'
import { Matricula } from './matricula'

type Departamento = 'DCC' | 'ICE'

type Curso = 'CC' | 'SI' | 'EC'

@Entity()
export class Aluno {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({
    type: 'varchar',
  })
  departamento: Departamento

  @Column({
    type: 'varchar',
  })
  curso: Curso

  @JoinColumn()
  @OneToOne(() => Credencial, (credencial) => credencial.aluno)
  credencial: Credencial

  @OneToMany(() => Matricula, (matricula) => matricula.aluno)
  matriculas: Matricula[]
}
