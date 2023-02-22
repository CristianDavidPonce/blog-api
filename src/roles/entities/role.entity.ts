import { Permission } from 'src/permissions/entities/permission.entity'
import { User } from 'src/users/entities/user.entity'
import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
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

  @ManyToOne(() => User, (user) => user.roles)
  user: User

  @ManyToMany(() => Permission)
  @JoinTable()
  permissions: Permission[]
}
