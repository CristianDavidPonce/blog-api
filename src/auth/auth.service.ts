import { Injectable } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { UsersService } from '../users/users.service'
import * as bcrypt from 'bcrypt'
export interface IUser {
  id: number
  userName: string
  firstName: string
  lastName: string
}
@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(username: string, pass: string): Promise<IUser> {
    const user = await this.usersService.findOneUsername(username)
    const isMatch = user && (await bcrypt.compare(pass, user.password))
    if (user && isMatch) {
      return {
        id: user.id,
        userName: user.userName,
        firstName: user.firstName,
        lastName: user.lastName,
      }
    }
    return null
  }
  async login(user: IUser) {
    const payload = user
    return {
      access_token: this.jwtService.sign(payload),
    }
  }
}
