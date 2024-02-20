import { Request, Router } from "express"
import AuthController from "../controllers/AuthController"
import Container from "typedi"
import { routeHandler } from "../../start/routeHandler"

export const authRoutes = Router()
const authController = Container.get(AuthController)

//prefix = auth/
authRoutes.post(
  "/register",
  routeHandler((req: Request) => authController.register(req))
)
authRoutes.post(
  "/login",
  routeHandler((req: Request) => authController.login(req))
)
authRoutes.post(
  "/refreshToken",
  routeHandler((req: Request) => authController.refreshToken(req))
)

authRoutes.post(
  "/forgotPassword",
  routeHandler((req: Request) => authController.forgotPassword(req))
)

authRoutes.post(
  "/saveNewPassword",
  routeHandler((req: Request) => authController.saveNewPassword(req))
)

authRoutes.post(
  "/verifyEmail",
  routeHandler((req: Request) => authController.verifyEmail(req))
)

authRoutes.post(
  "/resendVerifyToken",
  routeHandler((req: Request) => authController.resendVerifyToken(req))
)
