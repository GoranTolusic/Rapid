import { IsNotEmpty, IsString, IsNumber } from "class-validator"
import { Service } from "typedi"
import { ValidationProps } from "../../types/ValidationProps"

@Service()
class RefreshToken extends ValidationProps {
  @IsNotEmpty()
  @IsNumber()
  id: string

  @IsNotEmpty()
  @IsString()
  refreshToken: string

  static pickedProps(): string[] {
    return ["id", "refreshToken"]
  }
}

export default RefreshToken
