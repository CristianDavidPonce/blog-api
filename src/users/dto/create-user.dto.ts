export class CreateUserDto {
  userName: string;
  password: string;
  isActive: boolean;
  firstName: string;
  lastName: string;
  roles: number[];
}
