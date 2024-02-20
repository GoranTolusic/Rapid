import {
  IsNotEmpty,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from "class-validator"
import { Service } from "typedi"
import { ValidationProps } from "../../types/ValidationProps"

@Service()
class ResetPassword extends ValidationProps {
  @IsNotEmpty()
  @IsString()
  currentPassword: string

  @IsNotEmpty()
  @IsString()
  @MaxLength(64)
  @MinLength(8)
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])/, {
    message: "Password must contain both lower and upper case characters",
  })
  newPassword: string

  readonly updatedAt: number = Date.now()

  static pickedProps(): string[] {
    return ["currentPassword", "newPassword"]
  }
}

export default ResetPassword
