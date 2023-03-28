import { Post } from 'src/posts/entities/post.entity'
import { Record } from 'src/common/record.common'
import { User } from 'src/users/entities/user.entity'
import { Column, Entity, ManyToOne } from 'typeorm'

@Entity()
export class Comment extends Record {
  @Column()
  description: string

  @ManyToOne(() => User, (user) => user.comments)
  author: User

  @ManyToOne(() => Post, (post) => post.comments)
  post: Post
}
