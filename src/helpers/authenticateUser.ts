import { Unauthorized } from "@tsed/exceptions"
import { Request } from "express"
import JWTService from "../services/JWTService"

//middleware for checking if user holds accesstoken or not in headers.
export const authenticateUser = async (req: Request) => {
  if (!req.headers.accesstoken)
    throw new Unauthorized("You are not logged in", 401)
  const token = String(req.headers.accesstoken)
  const jwtService = new JWTService()
  let loggedUser
  try {
    loggedUser = jwtService.verifyToken(token)
    Object.assign(req, { loggedUser: loggedUser })
  } catch (e) {
    throw new Unauthorized(
      "Unable to verify accessToken or accessToken is expired",
      401
    )
  }

  if (!req.loggedUser.verified) throw new Unauthorized("Verify your email")
  if (!req.loggedUser.active) throw new Unauthorized("Account is not active")
}
