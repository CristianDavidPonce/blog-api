import { Role } from '../../../src/roles/entities/role.entity'
import { Entity, Column, ManyToOne, OneToMany } from 'typeorm'
import { Record } from 'src/common/record.common'
import { Post } from 'src/posts/entities/post.entity'
import { Comment } from 'src/comments/entities/comment.entity'

@Entity()
export class User extends Record {
  @Column({ unique: true })
  userName: string

  @Column()
  password: string

  @Column()
  firstName: string

  @Column()
  lastName: string

  @Column({ default: true })
  isActive: boolean

  @Column({ nullable: true })
  email: string

  @Column({ nullable: true })
  phone: string

  @ManyToOne(() => Role, (role) => role.users)
  role: Role

  @OneToMany(() => Post, (post) => post.author)
  posts: Post[]

  @OneToMany(() => Comment, (comment) => comment.author)
  comments: Post[]
}
