import { Unauthorized } from "@tsed/exceptions"
import { Request } from "express"

//middleware for checking if user holds accesstoken or not in headers.
export const authenticateRequest = async (req: Request) => {
  let error = true

  if (
    !req.headers.clientkey ||
    req.headers.clientkey !== process.env.CLIENT_KEY
  ) error = false


  if (error)
    throw new Unauthorized("You are not part of this universe. Get lost :)")
}
