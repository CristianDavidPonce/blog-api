import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import {
  IPaginationOptions,
  paginate,
  Pagination,
} from 'nestjs-typeorm-paginate'
import { Role } from 'src/roles/entities/role.entity'
import { In, Like, Repository } from 'typeorm'
import { CreateUserDto } from './dto/create-user.dto'
import { UpdateUserDto } from './dto/update-user.dto'
import { User } from './entities/user.entity'

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Role)
    private roleRepository: Repository<Role>,
  ) {}
  async create({ role, ...createUserDto }: CreateUserDto) {
    const record = this.userRepository.create(createUserDto)
    record.role = await this.roleRepository.findOneBy({ id: role })
    return this.userRepository.save(record)
  }

  async findAll(
    options: IPaginationOptions,
    { isActive, search, order },
  ): Promise<Pagination<User>> {
    const sort = order && JSON.parse(order)
    return paginate<User>(this.userRepository, options, {
      where: {
        ...(search ? { userName: Like(`%${search}%`) } : {}),
        ...(isActive !== undefined ? { isActive: isActive } : {}),
      },
      order: sort,
      relations: { role: { permissions: true } },
    })
  }

  findOne(id: number) {
    return this.userRepository.findOne({
      where: { id },
      relations: { role: { permissions: true } },
    })
  }

  findOneUsername(userName: string) {
    return this.userRepository.findOne({ where: { userName } })
  }

  async update(id: number, { role, ...updateUserDto }: UpdateUserDto) {
    const record = this.userRepository.create(updateUserDto)
    record.role = await this.roleRepository.findOneBy({ id: role })
    record.id = id
    return this.userRepository.save(record)
  }

  async remove(id: number) {
    return await this.userRepository.delete({ id })
  }
}
