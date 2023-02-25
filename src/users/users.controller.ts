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
  ParseBoolPipe,
} from '@nestjs/common'
import { UsersService } from './users.service'
import { CreateUserDto } from './dto/create-user.dto'
import { UpdateUserDto } from './dto/update-user.dto'
import * as bcrypt from 'bcrypt'
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard'
import { Permissions } from 'src/permissions/permissions.decorator'
import { PermissionsGuard } from 'src/permissions/permission.guard'

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    const saltOrRounds = 10
    const password = createUserDto.password
    if (password === undefined) {
      throw new HttpException(
        { message: 'No se proporcionó una contraseña' },
        HttpStatus.BAD_REQUEST,
      )
    }
    if (typeof password !== 'string') {
      throw new HttpException(
        { message: 'La constraseña debe ser de tipo string' },
        HttpStatus.BAD_REQUEST,
      )
    }
    const hash = await bcrypt.hash(password, saltOrRounds)
    return await this.usersService
      .create({ ...createUserDto, password: hash })
      .catch((err) => {
        throw new HttpException(
          { message: err.message },
          HttpStatus.BAD_REQUEST,
        )
      })
  }

  @Permissions({ module: 'users', action: 'read' })
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Get()
  async findAll(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
    @Query('isActive', new DefaultValuePipe(true), ParseBoolPipe)
    isActive: boolean,
    @Query('search') search: string,
    @Query('order') order: string,
  ) {
    return await this.usersService
      .findAll({ page, limit }, { isActive, search, order })
      .catch(
        (e) =>
          new HttpException(
            { message: e.message, detail: e },
            HttpStatus.BAD_REQUEST,
          ),
      )
  }

  @Permissions({ module: 'users', action: 'read' })
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(+id)
  }

  @Permissions({ module: 'users', action: 'edit' })
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    const res = await this.usersService
      .update(+id, updateUserDto)
      .catch((err) => {
        throw new HttpException(
          { message: err.message },
          HttpStatus.BAD_REQUEST,
        )
      })
    return res
  }

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permissions({ module: 'users', action: 'delete' })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id)
  }
}
