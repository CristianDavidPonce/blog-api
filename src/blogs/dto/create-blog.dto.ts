import { CreateDto } from 'src/common/record.common'

export class CreateBlogDto extends CreateDto {
  author?: number
  tags: number[]
}
