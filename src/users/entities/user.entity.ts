import { IsEmail, IsPhoneNumber } from 'class-validator'
import { Role } from '../../../src/roles/entities/role.entity'
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm'

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ unique: true })
  userName: string

  @Column()
  password: string

  @Column()
  firstName: string

  @Column()
  lastName: string

  @Column({ default: true })
  isActive: boolean

  @Column({ nullable: true })
  @IsEmail()
  email: string

  @Column({ nullable: true })
  @IsPhoneNumber('EC')
  phone: string

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  createAt: Date

  @Column()
  createdBy: string

  @ManyToOne(() => Role, (role) => role.users)
  role: Role
}
