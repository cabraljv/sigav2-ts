import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm'
import { Professor } from './professor'
import { Matricula } from './matricula'

type Departamento = 'DCC' | 'ICE'

type Status = 'EM_ANDAMENTO' | 'MATRICULAS' | 'FINALIZADA'

@Entity()
export class Disciplina {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({
    type: 'varchar',
  })
  departamento: Departamento

  @Column({
    type: 'varchar',
    default: 'MATRICULAS',
  })
  status: Status

  @Column({
    type: 'int',
  })
  cargaHoraria: number

  @Column({
    type: 'int',
  })
  maxAlunos: number

  @Column()
  codigo: string

  @Column()
  periodo: string

  @ManyToOne(() => Professor, (professor) => professor.disciplinas)
  professor: Professor

  @OneToMany(() => Matricula, (matricula) => matricula.disciplina)
  matriculas: Matricula[]

  matriculasCount?: number
}
