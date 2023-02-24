import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { UsersService } from 'src/users/users.service'
import { IPermission, PERMISSION_KEY } from './permissions.decorator'

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private readonly userService: UsersService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredPermissions = this.reflector.getAllAndOverride<IPermission[]>(
      PERMISSION_KEY,
      [context.getHandler(), context.getClass()],
    )
    if (!requiredPermissions) {
      return true
    }
    const { user } = context.switchToHttp().getRequest()

    const record = await this.userService.findOne(user.id)
    console.log(record)
    return record.role.permissions.some(
      (x) =>
        requiredPermissions.some((y) => y.action === x.action) &&
        requiredPermissions.some((y) => y.module === x.module),
    )
  }
}
