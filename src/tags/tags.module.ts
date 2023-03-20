import { Module } from '@nestjs/common'
import { TagsService } from './tags.service'
import { TagsController } from './tags.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Tag } from './entities/tag.entity'
import { UsersService } from 'src/users/users.service'
import { User } from 'src/users/entities/user.entity'
import { Role } from 'src/roles/entities/role.entity'
import { Permission } from 'src/permissions/entities/permission.entity'

@Module({
  imports: [TypeOrmModule.forFeature([Tag, User, Role, Permission])],
  controllers: [TagsController],
  providers: [TagsService, UsersService],
})
export class TagsModule {}
