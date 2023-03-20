import { Record } from 'src/common/record.common'
import { Enumerate } from 'src/utils'
import { Column, Entity, Index } from 'typeorm'

export type moduleType = 'users' | 'blogs' | 'roles'
export type actionType = 'read' | 'edit' | 'create' | 'delete'

export const module = new Enumerate<moduleType>([
  {
    value: 'users',
    label: 'Usuarios',
  },
  {
    value: 'blogs',
    label: 'Blogs',
  },
  {
    value: 'roles',
    label: 'Roles',
  },
])
export const action = new Enumerate<actionType>([
  {
    value: 'read',
    label: 'Leer',
  },
  {
    value: 'create',
    label: 'Crear',
  },
  {
    value: 'edit',
    label: 'Editar',
  },
  {
    value: 'delete',
    label: 'Borrar',
  },
])
@Entity()
@Index(['module', 'action'], { unique: true })
export class Permission extends Record {
  @Column({ type: 'enum', enum: module.getEnum() })
  module: moduleType
  @Column({ type: 'enum', enum: action.getEnum() })
  action: actionType
}
