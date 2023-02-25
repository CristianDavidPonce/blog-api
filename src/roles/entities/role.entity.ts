import { Permission } from 'src/permissions/entities/permission.entity'
import { User } from 'src/users/entities/user.entity'
import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm'

@Entity()
export class Role {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ unique: true })
  name: string

  @Column({ nullable: true })
  description: string

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date

  @Column({ nullable: true })
  createdBy: number

  @Column({ default: 'SYSTEM' })
  createdByName: string

  @Column({ nullable: true })
  updatedBy: number

  @Column({ default: 'SYSTEM' })
  updatedByName: string

  @OneToMany(() => User, (user) => user.role)
  users: User[]

  @ManyToMany(() => Permission, { cascade: true })
  @JoinTable()
  permissions: Permission[]
}
