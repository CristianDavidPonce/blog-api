import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import {
  IPaginationOptions,
  paginate,
  Pagination,
} from 'nestjs-typeorm-paginate'
import { Blog } from 'src/blogs/entities/blog.entity'
import { User } from 'src/users/entities/user.entity'
import { Like, Repository } from 'typeorm'
import { CreateCommentDto } from './dto/create-comment.dto'
import { UpdateCommentDto } from './dto/update-comment.dto'
import { Comment } from './entities/comment.entity'

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(Comment)
    private readonly commentRepository: Repository<Comment>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Blog)
    private readonly blogRepository: Repository<Blog>,
  ) {}
  async create({ author, blog, ...createcommentDto }: CreateCommentDto) {
    const record = this.commentRepository.create(createcommentDto)
    record.author = await this.userRepository.findOneBy({
      id: author,
    })
    record.blog = await this.blogRepository.findOneBy({
      id: blog,
    })
    return this.commentRepository.save(record)
  }

  findAll(
    options: IPaginationOptions,
    { order, search }: { order: string; search?: string },
  ): Promise<Pagination<Comment>> {
    const sort = order && JSON.parse(order)
    return paginate<Comment>(this.commentRepository, options, {
      where: {
        ...(search ? { description: Like(`%${search}%`) } : {}),
      },
      order: sort,
    })
  }

  findOne(id: number) {
    return this.commentRepository.findOne({ where: { id: id } })
  }

  async update(
    id: number,
    { author, blog, ...updatecommentDto }: UpdateCommentDto,
  ) {
    const record = this.commentRepository.create(updatecommentDto)
    record.blog = await this.blogRepository.findOneBy({
      id: blog,
    })
    return this.commentRepository.update(id, record)
  }

  remove(id: number) {
    return this.commentRepository.delete(id)
  }
}
