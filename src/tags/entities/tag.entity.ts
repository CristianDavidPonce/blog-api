import { Blog } from 'src/blogs/entities/blog.entity'
import { Record } from 'src/common/record.common'
import { Column, Entity, OneToMany } from 'typeorm'

@Entity()
export class Tag extends Record {
  @Column()
  name: string

  @OneToMany(() => Blog, (blog) => blog.tag)
  blogs: Blog[]
}
