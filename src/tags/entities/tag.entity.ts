import { Record } from 'src/common/record.common'
import { Column, Entity } from 'typeorm'

@Entity()
export class Tag extends Record {
  @Column()
  name: string
}
