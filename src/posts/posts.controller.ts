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
import { PostsService } from './posts.service'
import { CreatePostDto } from './dto/create-post.dto'
import { UpdatePostDto } from './dto/update-post.dto'
import { Permissions } from 'src/permissions/permissions.decorator'
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard'
import { PermissionsGuard } from 'src/permissions/permission.guard'
import { IUser } from 'src/auth/auth.service'
import { userReq } from 'src/common/record.common'

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}
  @Permissions({ module: 'posts', action: 'create' })
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Post()
  async create(
    @Body() createTagDto: CreatePostDto,
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
    return await this.postsService
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

  @Permissions({ module: 'posts', action: 'own' })
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Post('manage/own')
  async createOwn(
    @Body() createTagDto: CreatePostDto,
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
    return await this.postsService
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

  @Permissions({ module: 'posts', action: 'read' })
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Get()
  async findAll(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
    @Query('order') order: string,
    @Query('search') search: string,
  ) {
    return await this.postsService
      .findAll({ page, limit }, { order, search })
      .catch((err) => {
        throw new HttpException(
          { message: err.message, detail: err },
          HttpStatus.BAD_REQUEST,
        )
      })
  }

  @Permissions({ module: 'posts', action: 'own' })
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Get('manage/own')
  async findAllOwn(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
    @Query('order') order: string,
    @Query('search') search: string,
    @Req() req: { user?: IUser },
  ) {
    return await this.postsService
      .findAll({ page, limit }, { order, search, author: +req.user.id })
      .catch((err) => {
        throw new HttpException(
          { message: err.message, detail: err },
          HttpStatus.BAD_REQUEST,
        )
      })
  }

  @Permissions({ module: 'posts', action: 'read' })
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.postsService.findOne(+id)
  }

  @Permissions({ module: 'posts', action: 'own' })
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Get('manage/own/:id')
  findOneOwn(@Param('id') id: string) {
    return this.postsService.findOne(+id)
  }

  @Permissions({ module: 'posts', action: 'edit' })
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateTagDto: UpdatePostDto) {
    return await this.postsService.update(+id, updateTagDto).catch((err) => {
      throw new HttpException(
        { message: err.message, details: err },
        HttpStatus.BAD_REQUEST,
      )
    })
  }

  @Permissions({ module: 'posts', action: 'own' })
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Patch('manage/own/:id')
  async updateOwn(
    @Body() updateTagDto: UpdatePostDto,
    @Req() req: { user: IUser },
  ) {
    return await this.postsService
      .update(+req.user.id, updateTagDto)
      .catch((err) => {
        throw new HttpException(
          { message: err.message, details: err },
          HttpStatus.BAD_REQUEST,
        )
      })
  }

  @Permissions({ module: 'posts', action: 'delete' })
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.postsService.remove(+id)
  }
}
