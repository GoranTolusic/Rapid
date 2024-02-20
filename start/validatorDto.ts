import { ClassConstructor, plainToClass } from "class-transformer"
import { validate } from "class-validator"
import { BadRequest } from "@tsed/exceptions"
import { pick } from "lodash"

export const validatorDto = async <T extends ClassConstructor<any>>(
  dto: T,
  obj: any,
  pickedProps?: Array<any>
) => {
  // tranform the literal object to class object
  const objInstance = plainToClass(dto, pick(obj, pickedProps))
  // validating and check the errors, throw the errors if exist
  const errors = await validate(objInstance)
  // errors is an array of validation errors
  if (errors.length > 0) {
    throw new BadRequest(
      errors.map((item) => Object.values(item.constraints)).join(" | "),
      400
    )
  }
  //assign validated and formated values to request params
  Object.assign(obj, { _validated: objInstance })
  return objInstance
}
