import { CreateDto } from 'src/common/record.common'

export class CreateCommentDto extends CreateDto {
  description: string
  author: number
  blog: number
}
