import { Module } from '@nestjs/common'
import { CommentsService } from './comments.service'
import { CommentsController } from './comments.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Comment } from './entities/comment.entity'
import { UsersModule } from 'src/users/users.module'
import { User } from 'src/users/entities/user.entity'
import { Role } from 'src/roles/entities/role.entity'
import { Blog } from 'src/blogs/entities/blog.entity'
import { Tag } from 'src/tags/entities/tag.entity'

@Module({
  imports: [
    TypeOrmModule.forFeature([Comment, User, Role, Blog, Tag]),
    UsersModule,
  ],
  controllers: [CommentsController],
  providers: [CommentsService],
})
export class CommentsModule {}
