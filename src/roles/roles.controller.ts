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
import { RolesService } from './roles.service'
import { CreateRoleDto } from './dto/create-role.dto'
import { UpdateRoleDto } from './dto/update-role.dto'
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard'
import { IUser } from 'src/auth/auth.service'
import { userReq } from 'src/common/record.common'
import { Permissions } from 'src/permissions/permissions.decorator'
import { PermissionsGuard } from 'src/permissions/permission.guard'

@Controller('roles')
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}
  @Permissions({ module: 'roles', action: 'create' })
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Post()
  async create(
    @Req() req: { user: IUser },
    @Body() createRoleDto: CreateRoleDto,
  ) {
    return await this.rolesService
      .create({
        ...createRoleDto,
        ...userReq(req.user, 'create'),
      })
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

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateRoleDto: UpdateRoleDto,
    @Req() req: { user: IUser },
  ) {
    return await this.rolesService
      .update(+id, {
        ...updateRoleDto,
        ...userReq(req.user, 'edit'),
      })
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
