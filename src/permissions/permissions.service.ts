import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import {
  IPaginationOptions,
  paginate,
  Pagination,
} from 'nestjs-typeorm-paginate'
import { In, Repository } from 'typeorm'
import { CreatePermissionDto } from './dto/create-permission.dto'
import { UpdatePermissionDto } from './dto/update-permission.dto'
import {
  actionType,
  moduleType,
  Permission,
} from './entities/permission.entity'

@Injectable()
export class PermissionsService {
  constructor(
    @InjectRepository(Permission)
    private readonly permissionRepository: Repository<Permission>,
  ) {}
  create(createPermissionDto: CreatePermissionDto) {
    return this.permissionRepository.save(createPermissionDto)
  }

  findAll(
    options: IPaginationOptions,
    {
      modules,
      actions,
      order,
    }: { modules: moduleType; actions: actionType; order: string },
  ): Promise<Pagination<Permission>> {
    const sort = order && JSON.parse(order)
    return paginate<Permission>(this.permissionRepository, options, {
      where: {
        ...(modules ? { module: In(modules?.split(',')) } : {}),
        ...(actions ? { action: In(actions?.split(',')) } : {}),
      },
      order: sort,
    })
  }

  findOne(id: number) {
    return this.permissionRepository.findOne({ where: { id: id } })
  }

  update(id: number, updatePermissionDto: UpdatePermissionDto) {
    return this.permissionRepository.update(id, updatePermissionDto)
  }

  remove(id: number) {
    return this.permissionRepository.delete(id)
  }
}
