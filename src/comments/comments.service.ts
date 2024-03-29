import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import {
  IPaginationOptions,
  paginate,
  Pagination,
} from 'nestjs-typeorm-paginate'
import { Post } from 'src/posts/entities/post.entity'
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
    @InjectRepository(Post)
    private readonly postRepository: Repository<Post>,
  ) {}
  async create({ author, post, ...createcommentDto }: CreateCommentDto) {
    const record = this.commentRepository.create(createcommentDto)
    record.author = await this.userRepository.findOneBy({
      id: author,
    })
    record.post = await this.postRepository.findOneBy({
      id: post,
    })
    return this.commentRepository.save(record)
  }

  findAll(
    options: IPaginationOptions,
    { order, search, post }: { order: string; search?: string; post?: number },
  ): Promise<Pagination<Comment>> {
    const sort = order && JSON.parse(order)
    return paginate<Comment>(this.commentRepository, options, {
      where: {
        ...(search ? { description: Like(`%${search}%`) } : {}),
        ...(post ? { post: { id: post } } : {}),
      },
      order: sort,
      relations: { author: true, post: true },
    })
  }

  findOne(id: number) {
    return this.commentRepository.findOne({ where: { id: id } })
  }

  async update(
    id: number,
    { author, post, ...updatecommentDto }: UpdateCommentDto,
  ) {
    const record = this.commentRepository.create(updatecommentDto)
    record.post = await this.postRepository.findOneBy({
      id: post,
    })
    return this.commentRepository.update(id, record)
  }

  remove(id: number) {
    return this.commentRepository.delete(id)
  }
}
