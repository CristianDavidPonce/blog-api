import { IUser } from 'src/auth/auth.service'
import { BaseEntity, Column, PrimaryGeneratedColumn } from 'typeorm'

export abstract class Record extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date

  @Column({ nullable: true })
  createdBy: number

  @Column({ default: 'SYSTEM' })
  createdByName: string

  @Column({ nullable: true })
  updatedBy: number

  @Column({ default: 'SYSTEM' })
  updatedByName: string
}
export class CreateDto {
  createdBy?: number
  createdByName?: string
  updatedBy: number
  updatedByName: string
}

export const userReq = (user: IUser, type: 'create' | 'edit') =>
  type === 'create'
    ? {
        createdBy: user.id,
        createdByName: user.firstName + user.lastName,
        updatedBy: user.id,
        updatedByName: user.firstName + user.lastName,
      }
    : {
        updatedBy: user.id,
        updatedByName: user.firstName + user.lastName,
      }
