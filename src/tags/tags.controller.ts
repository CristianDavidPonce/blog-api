import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpException,
  HttpStatus,
  Query,
  DefaultValuePipe,
  ParseIntPipe,
  UseGuards,
  Req,
} from '@nestjs/common'
import { TagsService } from './tags.service'
import { CreateTagDto } from './dto/create-tag.dto'
import { UpdateTagDto } from './dto/update-tag.dto'
import { Permissions } from 'src/permissions/permissions.decorator'
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard'
import { PermissionsGuard } from 'src/permissions/permission.guard'
import { IUser } from 'src/auth/auth.service'
import { userReq } from 'src/common/record.common'

@Controller('tags')
export class TagsController {
  constructor(private readonly tagsService: TagsService) {}
  @Permissions({ module: 'tags', action: 'create' })
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Post()
  async create(
    @Body() createTagDto: CreateTagDto,
    @Req() req: { user: IUser },
  ) {
    return await this.tagsService
      .create({ ...createTagDto, ...userReq(req.user, 'create') })
      .catch((err) => {
        throw new HttpException(
          { message: err.message, detail: err },
          HttpStatus.BAD_REQUEST,
        )
      })
  }

  @Permissions({ module: 'tags', action: 'read' })
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Get()
  async findAll(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
    @Query('order') order: string,
  ) {
    return await this.tagsService
      .findAll({ page, limit }, { order })
      .catch((err) => {
        throw new HttpException(
          { message: err.message, detail: err },
          HttpStatus.BAD_REQUEST,
        )
      })
  }

  @Permissions({ module: 'tags', action: 'read' })
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.tagsService.findOne(+id)
  }

  @Permissions({ module: 'tags', action: 'edit' })
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateTagDto: UpdateTagDto) {
    return await this.tagsService.update(+id, updateTagDto).catch((err) => {
      throw new HttpException(
        { message: err.message, details: err },
        HttpStatus.BAD_REQUEST,
      )
    })
  }

  @Permissions({ module: 'tags', action: 'delete' })
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.tagsService.remove(+id)
  }
}
