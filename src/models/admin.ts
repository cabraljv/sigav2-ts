import { Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from 'typeorm'
import { Credencial } from './credencial'
@Entity()
export class Admin {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @JoinColumn()
  @OneToOne(() => Credencial, (credencial) => credencial.admin)
  credencial: Credencial
}
