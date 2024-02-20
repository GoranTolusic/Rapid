import {
  IsNotEmpty,
  IsEmail,
  IsString,
  IsOptional,
  MaxLength,
  MinLength,
  Matches,
} from "class-validator"
import { Service } from "typedi"
import { uid } from "uid"
import { ValidationProps } from "../../types/ValidationProps"

@Service()
class CreateUser extends ValidationProps {
  @IsOptional()
  @IsString()
  name: string

  @IsOptional()
  @IsString()
  surname: string

  @IsNotEmpty()
  @IsString()
  username: string

  @IsOptional()
  @IsString()
  phone: string

  @IsNotEmpty()
  @IsEmail()
  @IsString()
  email: string

  @IsNotEmpty()
  @IsString()
  @MaxLength(64)
  @MinLength(8)
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])/, {
    message: "Password must contain both lower and upper case characters",
  })
  password: string

  readonly verified: boolean = false

  readonly active: boolean = false

  readonly verifyToken: string = uid(32)

  readonly uid: string = uid(32)

  readonly createdAt: number = Date.now()

  readonly updatedAt: number = Date.now()

  readonly verifyExpiresAt: number =
    Date.now() + Number(process.env.VERIFY_TOKEN_EXPIRE || 3) * 60 * 1000

  //for now
  readonly globalState: string = "default"

  static pickedProps(): string[] {
    return [
      "name",
      "surname",
      "email",
      "password",
      "username",
      "phone",
    ]
  }
}

export default CreateUser
