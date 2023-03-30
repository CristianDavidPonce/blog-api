import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import {
  IPaginationOptions,
  paginate,
  Pagination,
} from 'nestjs-typeorm-paginate'
import { Role } from 'src/roles/entities/role.entity'
import { Like, Repository } from 'typeorm'
import { CreateUserDto } from './dto/create-user.dto'
import { UpdatePasswordUserDto, UpdateUserDto } from './dto/update-user.dto'
import { User } from './entities/user.entity'
import * as bcrypt from 'bcrypt'

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
    if (role !== undefined) {
      record.role = await this.roleRepository.findOneBy({ id: role })
    } else {
      record.role = await this.roleRepository.findOneBy({ default: true })
    }
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
      select: [
        'id',
        'userName',
        'isActive',
        'createdBy',
        'createdByName',
        'createdAt',
        'email',
        'firstName',
        'lastName',
        'isActive',
        'phone',
      ],
      relations: { role: true },
    })
  }

  findOne(id: number) {
    return this.userRepository.findOne({
      where: { id },
      select: [
        'id',
        'userName',
        'isActive',
        'createdBy',
        'createdByName',
        'createdAt',
        'email',
        'firstName',
        'lastName',
        'isActive',
        'phone',
      ],
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

  async updatePassword(
    id: number,
    { password, lastPassword }: UpdatePasswordUserDto,
  ) {
    const user = await this.userRepository.findOneBy({ id: id })
    const validation = await bcrypt.compare(lastPassword, user.password)
    console.log(validation)
    if (!validation) {
      throw new Error('La contrasena  antigua es incorrecta')
    }
    return this.userRepository.save({ id: id, password: password })
  }

  async remove(id: number) {
    return await this.userRepository.delete({ id })
  }
}
