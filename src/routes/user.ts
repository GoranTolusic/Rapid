import { Request, Router } from "express"
import Container from "typedi"
import { routeHandler } from "../../start/routeHandler"
import UserController from "../controllers/UserController"

export const userRoutes = Router()
const userController = Container.get(UserController)

//prefix = user/

userRoutes.get(
  "/:id",
  routeHandler((req: Request) => userController.get(req))
)

userRoutes.patch(
  "/:id/resetPassword",
  routeHandler((req: Request) => userController.resetPassword(req))
)

userRoutes.patch(
  "/:id",
  routeHandler((req: Request) => userController.update(req))
)

userRoutes.delete(
  "/:id",
  routeHandler((req: Request) => userController.delete(req))
)
