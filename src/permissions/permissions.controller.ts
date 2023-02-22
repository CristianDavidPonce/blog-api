import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  DefaultValuePipe,
  ParseIntPipe,
  HttpException,
  HttpStatus,
} from '@nestjs/common'
import { PermissionsService } from './permissions.service'
import { CreatePermissionDto } from './dto/create-permission.dto'
import { UpdatePermissionDto } from './dto/update-permission.dto'
import {
  action,
  actionType,
  module,
  moduleType,
} from './entities/permission.entity'

@Controller('permissions')
export class PermissionsController {
  constructor(private readonly permissionsService: PermissionsService) {}

  @Post()
  async create(@Body() createPermissionDto: CreatePermissionDto) {
    return await this.permissionsService
      .create(createPermissionDto)
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
    @Query('modules') modules: moduleType,
    @Query('actions') actions: actionType,
    @Query('order') order: string,
  ) {
    return await this.permissionsService
      .findAll({ page, limit }, { modules, actions, order })
      .catch((err) => {
        throw new HttpException(
          { message: err.message, detail: err },
          HttpStatus.BAD_REQUEST,
        )
      })
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.permissionsService.findOne(+id)
  }

  @Get('/get/options')
  getOptions() {
    return { module: module.getData(), action: action.getData() }
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updatePermissionDto: UpdatePermissionDto,
  ) {
    return await this.permissionsService
      .update(+id, updatePermissionDto)
      .catch((err) => {
        throw new HttpException(
          { message: err.message, details: err },
          HttpStatus.BAD_REQUEST,
        )
      })
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.permissionsService.remove(+id)
  }
}
