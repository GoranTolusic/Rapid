import { IsNotEmpty, IsString } from "class-validator"
import { Service } from "typedi"
import { ValidationProps } from "../../types/ValidationProps"

@Service()
class VerifyEmail extends ValidationProps {
  @IsNotEmpty()
  @IsString()
  uid: string

  @IsNotEmpty()
  @IsString()
  verifyToken: string

  static pickedProps(): string[] {
    return ["verifyToken", "uid"]
  }
}

export default VerifyEmail
