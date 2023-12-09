import {
  Column,
  Entity,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm'
import { Disciplina } from './disciplina'
import { Credencial } from './credencial'

type Departamento = 'DCC' | 'ICE'

@Entity()
export class Professor {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({
    type: 'varchar',
  })
  departamento: Departamento

  @OneToMany(() => Disciplina, (disciplina) => disciplina.professor)
  disciplinas: Disciplina[]

  @OneToOne(() => Credencial, (credencial) => credencial.professor)
  credencial: Credencial
}
