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
import { CommentsService } from './comments.service'
import { CreateCommentDto } from './dto/create-comment.dto'
import { UpdateCommentDto } from './dto/update-comment.dto'
import { Permissions } from 'src/permissions/permissions.decorator'
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard'
import { PermissionsGuard } from 'src/permissions/permission.guard'
import { IUser } from 'src/auth/auth.service'
import { userReq } from 'src/common/record.common'

@Controller('comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}
  @Permissions({ module: 'comments', action: 'create' })
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Post()
  async create(
    @Body() createCommentDto: CreateCommentDto,
    @Req() req: { user: IUser },
  ) {
    if (createCommentDto.post === undefined) {
      throw new HttpException(
        { message: 'No se proporcionó un post' },
        HttpStatus.BAD_REQUEST,
      )
    }
    return await this.commentsService
      .create({
        ...createCommentDto,
        ...userReq(req.user, 'create'),
        author: req.user.id,
      })
      .catch((err) => {
        throw new HttpException(
          { message: err.message, detail: err },
          HttpStatus.BAD_REQUEST,
        )
      })
  }

  @Get()
  async findAll(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
    @Query('order') order: string,
    @Query('search') search: string,
    @Query('post') post: string,
  ) {
    return await this.commentsService
      .findAll({ page, limit }, { order, search, post: +post })
      .catch((err) => {
        throw new HttpException(
          { message: err.message, detail: err },
          HttpStatus.BAD_REQUEST,
        )
      })
  }

  @Permissions({ module: 'comments', action: 'read' })
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.commentsService.findOne(+id)
  }

  @Permissions({ module: 'comments', action: 'edit' })
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateCommentDto: UpdateCommentDto,
  ) {
    return await this.commentsService
      .update(+id, updateCommentDto)
      .catch((err) => {
        throw new HttpException(
          { message: err.message, details: err },
          HttpStatus.BAD_REQUEST,
        )
      })
  }

  @Permissions({ module: 'comments', action: 'delete' })
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.commentsService.remove(+id)
  }
}
