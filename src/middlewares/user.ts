import { Router, Request } from "express"
import { middlewareHandler } from "../../start/middlewareHandler"
import { BadRequest, Forbidden } from "@tsed/exceptions"
import { authenticateUser } from "../helpers/authenticateUser"
import { validatorDto } from "../../start/validatorDto"
import UpdateUser from "../validationTypes/UpdateUser"
import ResetPassword from "../validationTypes/ResetPassword"

export const userMiddleware = Router()

//prefix = user/

//global middleware for all user/ routes
userMiddleware.use(middlewareHandler(authenticateUser))

//Specificic endpoints middlewares
userMiddleware.get(
  "/engineStatus/:id/:type",
  middlewareHandler(async (req: Request) => {
    if (!["google-messenger", "imessage", "facebook"].includes(req.params.type))
      throw new BadRequest("Invalid type in URI")
    if (isNaN(Number(req.params.id))) throw new BadRequest("Invalid URI id")
    if (req.loggedUser.id !== Number(req.params.id))
      throw new Forbidden("You are not authorized to access other users data")
  })
)

userMiddleware.get(
  "/:id",
  middlewareHandler(async (req: Request) => {
    if (isNaN(Number(req.params.id))) throw new BadRequest("Invalid URI id")
    if (req.loggedUser.id !== Number(req.params.id))
      throw new Forbidden("You are not authorized to access other users data")
  })
)

userMiddleware.patch(
  "/:id/resetPassword",
  middlewareHandler(async (req: Request) => {
    if (isNaN(Number(req.params.id))) throw new BadRequest("Invalid URI id")
    if (req.loggedUser.id !== Number(req.params.id))
      throw new Forbidden(
        "You are not authorized to change password of other users"
      )
    await validatorDto(ResetPassword, req.body, ResetPassword.pickedProps())
  })
)

userMiddleware.patch(
  "/:id",
  middlewareHandler(async (req: Request) => {
    if (isNaN(Number(req.params.id))) throw new BadRequest("Invalid URI id")
    if (req.loggedUser.id !== Number(req.params.id))
      throw new Forbidden("You are not authorized to update other users data")
    await validatorDto(UpdateUser, req.body, UpdateUser.pickedProps())
  })
)

userMiddleware.delete(
  "/:id",
  middlewareHandler(async (req: Request) => {
    if (isNaN(Number(req.params.id))) throw new BadRequest("Invalid URI id")
    if (req.loggedUser.id !== Number(req.params.id))
      throw new Forbidden("You are not authorized to delete other user account")
  })
)
