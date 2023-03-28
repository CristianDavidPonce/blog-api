import { Module } from '@nestjs/common'
import { PostsService } from './posts.service'
import { PostsController } from './posts.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Tag } from 'src/tags/entities/tag.entity'
import { Post } from './entities/post.entity'
import { UsersModule } from 'src/users/users.module'
import { User } from 'src/users/entities/user.entity'
import { Role } from 'src/roles/entities/role.entity'

@Module({
  imports: [TypeOrmModule.forFeature([Post, Tag, User, Role]), UsersModule],
  controllers: [PostsController],
  providers: [PostsService],
  exports: [PostsService],
})
export class PostsModule {}
