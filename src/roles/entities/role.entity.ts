import { Record } from 'src/common/record.common'
import { Permission } from 'src/permissions/entities/permission.entity'
import { User } from 'src/users/entities/user.entity'
import { Column, Entity, JoinTable, ManyToMany, OneToMany } from 'typeorm'

@Entity()
export class Role extends Record {
  @Column({ unique: true })
  name: string

  @Column({ nullable: true })
  description: string

  @Column({ nullable: true })
  default: boolean

  @OneToMany(() => User, (user) => user.role)
  users: User[]

  @ManyToMany(() => Permission, { cascade: true })
  @JoinTable()
  permissions: Permission[]
}
