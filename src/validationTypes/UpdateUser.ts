import { IsOptional, IsString } from "class-validator"
import { Service } from "typedi"
import { ValidationProps } from "../../types/ValidationProps"

@Service()
class UpdateUser extends ValidationProps {
  @IsOptional()
  @IsString()
  name: string

  @IsOptional()
  @IsString()
  surname: string

  readonly updatedAt: number = Date.now()

  static pickedProps(): string[] {
    return ["name", "surname"]
  }
}

export default UpdateUser
