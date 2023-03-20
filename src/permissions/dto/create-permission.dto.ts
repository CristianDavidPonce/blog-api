import { CreateDto } from 'src/common/record.common'
import { moduleType, actionType } from '../entities/permission.entity'

export class CreatePermissionDto extends CreateDto {
  module: moduleType
  action: actionType
}
