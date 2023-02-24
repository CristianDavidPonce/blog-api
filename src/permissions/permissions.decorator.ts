import { SetMetadata } from '@nestjs/common'
import { moduleType, actionType } from './entities/permission.entity'

export interface IPermission {
  module: moduleType
  action: actionType
}
export const PERMISSION_KEY = 'permissions'
export const Permissions = (...permissions: IPermission[]) =>
  SetMetadata(PERMISSION_KEY, permissions)
