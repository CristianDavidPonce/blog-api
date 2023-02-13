import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  IPaginationOptions,
  paginate,
  Pagination,
} from 'nestjs-typeorm-paginate';
import { Role } from 'src/roles/entities/role.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Role)
    private roleRepository: Repository<Role>,
  ) {}
  async create(createUserDto: CreateUserDto) {
    const roles = [];
    for (let i = 0; i < createUserDto.roles.length; i++) {
      await this.roleRepository
        .findOne({
          where: {
            id: createUserDto.roles[i],
          },
        })
        .then((x) => {
          roles.push(x);
        })
        .catch((e) => console.log(e));
    }
    const newUser = this.userRepository.create({ ...createUserDto, roles: [] });
    newUser.roles = roles;
    return this.userRepository.save(newUser);
  }

  async findAll(options: IPaginationOptions): Promise<Pagination<User>> {
    return paginate<User>(this.userRepository, options, {
      relations: { roles: true },
    });
  }

  findOne(id: number) {
    return this.userRepository.findOne({ where: { id } });
  }

  findOneUsername(userName: string) {
    return this.userRepository.findOne({ where: { userName } });
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    return 'ojo';
  }

  async remove(id: number) {
    const res = await this.userRepository
      .createQueryBuilder()
      .delete()
      .from(User)
      .where({ id })
      .execute();
    return res;
  }
}
