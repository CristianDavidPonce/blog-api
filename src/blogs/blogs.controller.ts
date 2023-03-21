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
import { BlogsService } from './blogs.service'
import { CreateBlogDto } from './dto/create-blog.dto'
import { UpdateBlogDto } from './dto/update-blog.dto'
import { Permissions } from 'src/permissions/permissions.decorator'
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard'
import { PermissionsGuard } from 'src/permissions/permission.guard'
import { IUser } from 'src/auth/auth.service'
import { userReq } from 'src/common/record.common'

@Controller('blogs')
export class BlogsController {
  constructor(private readonly blogsService: BlogsService) {}
  @Permissions({ module: 'blogs', action: 'create' })
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Post()
  async create(
    @Body() createTagDto: CreateBlogDto,
    @Req() req: { user?: IUser },
  ) {
    if (createTagDto.tags === undefined) {
      throw new HttpException(
        {
          message: 'No se proporcionó los tags',
        },
        HttpStatus.BAD_REQUEST,
      )
    }
    return await this.blogsService
      .create({
        ...createTagDto,
        ...userReq(req.user, 'create'),
        author: req.user?.id,
      })
      .catch((err) => {
        throw new HttpException(
          { message: err.message, detail: err },
          HttpStatus.BAD_REQUEST,
        )
      })
  }

  @Permissions({ module: 'blogs', action: 'read' })
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Get()
  async findAll(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
    @Query('order') order: string,
    @Query('search') search: string,
  ) {
    return await this.blogsService
      .findAll({ page, limit }, { order, search })
      .catch((err) => {
        throw new HttpException(
          { message: err.message, detail: err },
          HttpStatus.BAD_REQUEST,
        )
      })
  }

  @Permissions({ module: 'blogs', action: 'read' })
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.blogsService.findOne(+id)
  }

  @Permissions({ module: 'blogs', action: 'edit' })
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateTagDto: UpdateBlogDto) {
    return await this.blogsService.update(+id, updateTagDto).catch((err) => {
      throw new HttpException(
        { message: err.message, details: err },
        HttpStatus.BAD_REQUEST,
      )
    })
  }

  @Permissions({ module: 'blogs', action: 'delete' })
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.blogsService.remove(+id)
  }
}
