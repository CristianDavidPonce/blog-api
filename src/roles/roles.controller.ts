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
} from '@nestjs/common'
import { RolesService } from './roles.service'
import { CreateRoleDto } from './dto/create-role.dto'
import { UpdateRoleDto } from './dto/update-role.dto'

@Controller('roles')
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @Post()
  async create(@Body() createRoleDto: CreateRoleDto) {
    return await this.rolesService
      .create(createRoleDto)
      .catch(
        (e) =>
          new HttpException(
            { message: e.message || 'Error', details: e },
            HttpStatus.BAD_REQUEST,
          ),
      )
  }

  @Get()
  findAll(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
  ) {
    return this.rolesService.findAll({ page, limit })
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.rolesService.findOne(+id)
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateRoleDto: UpdateRoleDto) {
    return await this.rolesService
      .update(+id, updateRoleDto)
      .catch(
        (e) =>
          new HttpException(
            { message: e.message, details: e },
            HttpStatus.BAD_REQUEST,
          ),
      )
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.rolesService.remove(+id).catch((err) => {
      throw new HttpException(
        { message: err.message, code: HttpStatus.BAD_REQUEST },
        HttpStatus.BAD_REQUEST,
      )
    })
  }
}
