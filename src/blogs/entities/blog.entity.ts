import { Comment } from 'src/comments/entities/comment.entity'
import { Record } from 'src/common/record.common'
import { Tag } from 'src/tags/entities/tag.entity'
import { User } from 'src/users/entities/user.entity'
import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
} from 'typeorm'

@Entity()
export class Blog extends Record {
  @Column()
  title: string

  @Column({ nullable: true })
  subtitle: string

  @Column({ nullable: true })
  content: string

  @ManyToOne(() => User, (user) => user.blogs)
  author: User

  @OneToMany(() => Comment, (comment) => comment.blog)
  comments: Comment[]

  @ManyToMany(() => Tag, { cascade: true })
  @JoinTable()
  tags: Tag[]
}
