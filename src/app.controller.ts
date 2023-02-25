import {
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common'
import { AppService } from './app.service'
import { LocalAuthGuard } from './auth/auth.local-auth.guards'
import { AuthService, IUser } from './auth/auth.service'
import { JwtAuthGuard } from './auth/jwt-auth.guard'
import { PermissionsGuard } from './permissions/permission.guard'
import { UsersService } from './users/users.service'

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private authService: AuthService,
    private userService: UsersService,
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello()
  }
  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Request() req: { user: IUser }) {
    return this.authService.login(req.user)
  }

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Get('profile')
  async getProfile(@Request() req: { user: IUser }) {
    return await this.userService.findOne(req.user.id).catch((e) => {
      new HttpException(
        { message: e.message, detail: e },
        HttpStatus.BAD_REQUEST,
      )
    })
  }
}
