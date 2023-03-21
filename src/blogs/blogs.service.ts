import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import {
  IPaginationOptions,
  paginate,
  Pagination,
} from 'nestjs-typeorm-paginate'
import { Tag } from 'src/tags/entities/tag.entity'
import { User } from 'src/users/entities/user.entity'
import { In, Like, Repository } from 'typeorm'
import { CreateBlogDto } from './dto/create-blog.dto'
import { UpdateBlogDto } from './dto/update-blog.dto'
import { Blog } from './entities/blog.entity'

@Injectable()
export class BlogsService {
  constructor(
    @InjectRepository(Blog)
    private readonly blogRepository: Repository<Blog>,
    @InjectRepository(Tag)
    private readonly tagRepository: Repository<Tag>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}
  async create({ tags, author, ...createBlogDto }: CreateBlogDto) {
    const record = this.blogRepository.create(createBlogDto)
    record.tags = await this.tagRepository.findBy({
      id: In(tags),
    })
    record.author = await this.userRepository.findOneBy({
      id: author,
    })
    return this.blogRepository.save(record)
  }

  findAll(
    options: IPaginationOptions,
    { order, search }: { order: string; search?: string },
  ): Promise<Pagination<Blog>> {
    const sort = order && JSON.parse(order)
    return paginate<Blog>(this.blogRepository, options, {
      where: {
        ...(search ? { title: Like(`%${search}%`) } : {}),
      },
      order: sort,
      relations: { tags: true, author: true },
    })
  }

  findOne(id: number) {
    return this.blogRepository.findOne({
      where: { id: id },
      relations: { tags: true, author: true, comments: true },
    })
  }

  async update(id: number, { tags, author, ...updateBlogDto }: UpdateBlogDto) {
    const record = this.blogRepository.create(updateBlogDto)
    record.tags = await this.tagRepository.findBy({
      id: In(tags),
    })
    record.id = id
    return this.blogRepository.save(record)
  }

  remove(id: number) {
    return this.blogRepository.delete(id)
  }
}
