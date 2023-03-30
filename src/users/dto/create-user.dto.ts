import { CreateDto } from 'src/common/record.common'

export class CreateUserDto extends CreateDto {
  userName: string
  password: string
  isActive: boolean
  firstName: string
  lastName: string
  role?: number
}
