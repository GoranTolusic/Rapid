import { IsNotEmpty, IsEmail, IsString } from "class-validator"
import { Service } from "typedi"
import { ValidationProps } from "../../types/ValidationProps"

@Service()
class LoginUser extends ValidationProps {
  @IsNotEmpty()
  @IsEmail()
  @IsString()
  email: string

  @IsNotEmpty()
  @IsString()
  password: string

  static pickedProps(): string[] {
    return ["email", "password"]
  }
}

export default LoginUser
