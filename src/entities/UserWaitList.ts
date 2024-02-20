import { Entity, PrimaryGeneratedColumn, Column } from "typeorm"

@Entity("users_waitlist")
export class UserWaitList {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ unique: true })
  email: string

  @Column()
  createdAt: number

  @Column()
  updatedAt: number
}
