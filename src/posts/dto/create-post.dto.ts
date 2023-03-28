import { CreateDto } from 'src/common/record.common'

export class CreatePostDto extends CreateDto {
  author?: number
  tags: number[]
}
