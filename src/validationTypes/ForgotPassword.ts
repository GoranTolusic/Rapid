import { IsNotEmpty, IsEmail, IsString, IsIn } from "class-validator"
import { Service } from "typedi"
import { ValidationProps } from "../../types/ValidationProps"
import { uid } from "uid"

@Service()
class ForgotPassword extends ValidationProps {
  @IsNotEmpty()
  @IsEmail()
  @IsString()
  email: string

  readonly resetPasswordExpiresAt: number =
    Date.now() + Number(process.env.FORGOT_PASSWORD_EXPIRE || 3) * 60 * 1000

  readonly resetPasswordToken: string = uid(64)

  static pickedProps(): string[] {
    return ["email"]
  }
}

export default ForgotPassword
