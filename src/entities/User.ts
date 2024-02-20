import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm"

@Entity("users")
export class User {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  name?: string

  @Column()
  surname?: string

  @Column({ unique: true })
  username: string

  @Column({ unique: true })
  email: string

  @Column()
  phone?: string

  @Column({ select: false })
  password?: string

  @Column({ default: false })
  verified: boolean

  @Column({ default: "default" })
  globalState: string

  @Column({ select: false })
  verifyToken?: string

  @Column({ select: false })
  refreshToken?: string

  @Column({ default: false })
  active: boolean

  @Column({ unique: true })
  uid: string

  @Column({ default: 0 })
  loginAttempts: number

  @Column()
  restrictLoginUntil: number

  @Column()
  createdAt: number

  @Column()
  updatedAt: number

  @Column()
  deletedAt?: number

  @Column()
  resetPasswordToken: string

  @Column()
  resetPasswordExpiresAt: number

  @Column()
  verifyExpiresAt: number

  @Column({ default: 0 })
  forgotPasswordAttempts: number

  @Column()
  restrictForgotPasswordUntil: number
}
