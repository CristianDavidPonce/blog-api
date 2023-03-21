import { Module } from '@nestjs/common'
import { BlogsService } from './blogs.service'
import { BlogsController } from './blogs.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Tag } from 'src/tags/entities/tag.entity'
import { Blog } from './entities/blog.entity'
import { UsersModule } from 'src/users/users.module'
import { User } from 'src/users/entities/user.entity'
import { Role } from 'src/roles/entities/role.entity'

@Module({
  imports: [TypeOrmModule.forFeature([Blog, Tag, User, Role]), UsersModule],
  controllers: [BlogsController],
  providers: [BlogsService],
  exports: [BlogsService],
})
export class BlogsModule {}
