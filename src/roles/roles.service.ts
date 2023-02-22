import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import {
  IPaginationOptions,
  paginate,
  Pagination,
} from 'nestjs-typeorm-paginate'
import { Permission } from 'src/permissions/entities/permission.entity'
import { Repository } from 'typeorm'
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
  async create(createRoleDto: CreateRoleDto) {
    const permissions: Permission[] = []
    for (let i = 0; i < createRoleDto.permissions.length; i++) {
      await this.permissionRepository
        .findOne({
          where: {
            id: createRoleDto.permissions[i],
          },
        })
        .then((x) => {
          permissions.push(x)
        })
        .catch((e) => {
          throw new Error(e)
        })
    }
    const newRol = this.roleRepository.create({
      ...createRoleDto,
      permissions: [],
    })
    newRol.permissions = permissions
    return this.roleRepository.save(newRol)
  }

  async findAll(options: IPaginationOptions): Promise<Pagination<Role>> {
    return paginate<Role>(this.roleRepository, options, {
      relations: { permissions: true },
    })
  }

  findOne(id: number) {
    return this.roleRepository.findOne({ where: { id } })
  }

  update(id: number, updateRoleDto: UpdateRoleDto) {
    return `This action updates a #${id} role`
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
