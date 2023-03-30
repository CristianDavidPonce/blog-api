import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import {
  IPaginationOptions,
  paginate,
  Pagination,
} from 'nestjs-typeorm-paginate'
import { Permission } from 'src/permissions/entities/permission.entity'
import { In, Repository } from 'typeorm'
import { CreateRoleDto } from './dto/create-role.dto'
import { UpdateRoleDto } from './dto/update-role.dto'
import { Role } from './entities/role.entity'

@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
    @InjectRepository(Permission)
    private permissionRepository: Repository<Permission>,
  ) {}
  async create({ permissions, ...createRoleDto }: CreateRoleDto) {
    const record = this.roleRepository.create(createRoleDto)
    record.permissions = await this.permissionRepository.findBy({
      id: In(permissions),
    })
    return this.roleRepository.save(record)
  }

  async findAll(options: IPaginationOptions): Promise<Pagination<Role>> {
    return paginate<Role>(this.roleRepository, options, {
      relations: { permissions: true },
    })
  }

  findOne(id: number) {
    return this.roleRepository.findOne({
      where: { id },
      relations: { permissions: true, users: true },
    })
  }

  async update(id: number, { permissions, ...updateRoleDto }: UpdateRoleDto) {
    const record = this.roleRepository.create(updateRoleDto)
    if (permissions) {
      record.permissions = await this.permissionRepository.findBy({
        id: In(permissions),
      })
    }
    record.id = id
    return this.roleRepository.save(record)
  }

  async remove(id: number) {
    const res = await this.roleRepository
      .createQueryBuilder()
      .delete()
      .from(Role)
      .where({ id })
      .execute()
    return res
  }
}
