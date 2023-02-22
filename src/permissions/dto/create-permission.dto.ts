import { moduleType, actionType } from '../entities/permission.entity';

export class CreatePermissionDto {
  module: moduleType;
  action: actionType;
}
