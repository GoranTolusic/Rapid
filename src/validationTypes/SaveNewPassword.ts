import {
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
  Matches,
} from "class-validator"
import { Service } from "typedi"
import { ValidationProps } from "../../types/ValidationProps"

@Service()
class SaveNewPassword extends ValidationProps {
  @IsNotEmpty()
  @IsString()
  @MaxLength(64)
  @MinLength(8)
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])/, {
    message: "Password must contain both lower and upper case characters",
  })
  password: string

  @IsNotEmpty()
  @IsString()
  uid: string

  @IsNotEmpty()
  @IsString()
  resetPasswordToken: string

  static pickedProps(): string[] {
    return ["password", "resetPasswordToken", "uid"]
  }
}

export default SaveNewPassword
