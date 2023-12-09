import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm'
import { Disciplina } from './disciplina'
import { Aluno } from './aluno'
import { Avaliacao } from './avaliacao'

export type StatusMatricula =
  | 'TRANCADA'
  | 'RI'
  | 'APROVADA'
  | 'REPROVADA'
  | 'CURSANDO'

@Entity()
export class Matricula {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({
    type: 'varchar',
  })
  status: Status

  @Column({
    type: 'int',
  })
  faltas: number

  @ManyToOne(() => Disciplina, (disciplina) => disciplina.matriculas)
  disciplina: Disciplina

  @ManyToOne(() => Aluno, (aluno) => aluno.matriculas)
  aluno: Aluno

  @OneToMany(() => Avaliacao, (avaliacao) => avaliacao.matricula)
  avaliacoes: Avaliacao[]
}
