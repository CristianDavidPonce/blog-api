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
import { CreatePostDto } from './dto/create-post.dto'
import { UpdatePostDto } from './dto/update-post.dto'
import { Post } from './entities/post.entity'

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Post)
    private readonly postRepository: Repository<Post>,
    @InjectRepository(Tag)
    private readonly tagRepository: Repository<Tag>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}
  async create({ tags, author, ...createPostDto }: CreatePostDto) {
    const record = this.postRepository.create(createPostDto)
    record.tags = await this.tagRepository.findBy({
      id: In(tags),
    })
    record.author = await this.userRepository.findOneBy({
      id: author,
    })
    return this.postRepository.save(record)
  }

  findAll(
    options: IPaginationOptions,
    {
      order,
      search,
      author,
    }: { order: string; search?: string; author?: number },
  ): Promise<Pagination<Post>> {
    const sort = order && JSON.parse(order)
    return paginate<Post>(this.postRepository, options, {
      where: {
        ...(search ? { title: Like(`%${search}%`) } : {}),
        ...(author ? { authorId: author } : {}),
      },
      order: sort,
      relations: { tags: true, author: true },
    })
  }

  findOne(id: number) {
    return this.postRepository.findOne({
      where: { id: id },
      relations: { tags: true, author: true, comments: true },
    })
  }

  async update(id: number, { tags, author, ...updatePostDto }: UpdatePostDto) {
    const record = this.postRepository.create(updatePostDto)
    record.tags = await this.tagRepository.findBy({
      id: In(tags),
    })
    record.id = id
    return this.postRepository.save(record)
  }

  remove(id: number) {
    return this.postRepository.delete(id)
  }
}
