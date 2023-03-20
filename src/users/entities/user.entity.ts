import { IsEmail, IsPhoneNumber } from 'class-validator'
import { Role } from '../../../src/roles/entities/role.entity'
import { Entity, Column, ManyToOne } from 'typeorm'
import { Record } from 'src/common/record.common'

@Entity()
export class User extends Record {
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

  @ManyToOne(() => Role, (role) => role.users)
  role: Role
}
