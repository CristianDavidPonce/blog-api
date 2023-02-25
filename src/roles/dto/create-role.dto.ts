export class CreateRoleDto {
  name: string
  description?: string
  permissions: number[]
  createdBy?: number
  createdByName?: string
}
