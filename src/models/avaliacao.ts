import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'
import { Matricula } from './matricula'
@Entity()
export class Avaliacao {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({
    type: 'int',
  })
  peso: number

  @Column({
    type: 'int',
  })
  nota: number

  @ManyToOne(() => Matricula, (matricula) => matricula.avaliacoes)
  matricula: Matricula
}
