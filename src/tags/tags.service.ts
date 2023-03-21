import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import {
  IPaginationOptions,
  paginate,
  Pagination,
} from 'nestjs-typeorm-paginate'
import { Like, Repository } from 'typeorm'
import { CreateTagDto } from './dto/create-tag.dto'
import { UpdateTagDto } from './dto/update-tag.dto'
import { Tag } from './entities/tag.entity'

@Injectable()
export class TagsService {
  constructor(
    @InjectRepository(Tag)
    private readonly tagRepository: Repository<Tag>,
  ) {}
  create(createtagDto: CreateTagDto) {
    return this.tagRepository.save(createtagDto)
  }

  findAll(
    options: IPaginationOptions,
    { order, search }: { order: string; search?: string },
  ): Promise<Pagination<Tag>> {
    const sort = order && JSON.parse(order)
    return paginate<Tag>(this.tagRepository, options, {
      where: {
        ...(search ? { name: Like(`%${search}%`) } : {}),
      },
      order: sort,
    })
  }

  findOne(id: number) {
    return this.tagRepository.findOne({ where: { id: id } })
  }

  update(id: number, updatetagDto: UpdateTagDto) {
    return this.tagRepository.update(id, updatetagDto)
  }

  remove(id: number) {
    return this.tagRepository.delete(id)
  }
}
