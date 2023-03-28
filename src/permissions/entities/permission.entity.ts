import { Record } from 'src/common/record.common'
import { Enumerate } from 'src/utils'
import { Column, Entity, Index } from 'typeorm'

export type moduleType = 'users' | 'posts' | 'roles' | 'tags' | 'comments'
export type actionType = 'read' | 'edit' | 'create' | 'delete' | 'own'

export const module = new Enumerate<moduleType>([
  {
    value: 'users',
    label: 'Usuarios',
  },
  {
    value: 'posts',
    label: 'Posts',
  },
  {
    value: 'roles',
    label: 'Roles',
  },
  {
    value: 'comments',
    label: 'Comentarios',
  },
  {
    value: 'tags',
    label: 'Tags',
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
  {
    value: 'own',
    label: 'Propio',
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
