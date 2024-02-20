import { IsNotEmpty, IsEmail, IsString, IsIn } from "class-validator"
import { Service } from "typedi"
import { uid } from "uid"
import { ValidationProps } from "../../types/ValidationProps"

@Service()
class ResendVerifyToken extends ValidationProps {
  @IsNotEmpty()
  @IsEmail()
  @IsString()
  email: string

  readonly verifyToken: string = uid(32)

  readonly updatedAt: number = Date.now()

  readonly verifyExpiresAt: number =
    Date.now() + Number(process.env.VERIFY_TOKEN_EXPIRE || 3) * 60 * 1000

  static pickedProps(): string[] {
    return ["email"]
  }
}

export default ResendVerifyToken
