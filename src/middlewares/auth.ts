import { Router, Request } from "express"
import CreateUser from "../validationTypes/CreateUser"
import { validatorDto } from "../../start/validatorDto"
import { middlewareHandler } from "../../start/middlewareHandler"
import RefreshToken from "../validationTypes/RefreshToken"
import LoginUser from "../validationTypes/LoginUser"
import ForgotPassword from "../validationTypes/ForgotPassword"
import SaveNewPassword from "../validationTypes/SaveNewPassword"
import VerifyEmail from "../validationTypes/VerifyEmail"
import ResendVerifyToken from "../validationTypes/ResendVerifyToken"

export const authMiddleware = Router()

//prefix = auth/

//Specificic endpoints middlewares
authMiddleware.post(
  "/register",
  middlewareHandler(async (req: Request) => {
    await validatorDto(CreateUser, req.body, CreateUser.pickedProps())
  })
)

authMiddleware.post(
  "/login",
  middlewareHandler(async (req: Request) => {
    await validatorDto(LoginUser, req.body, LoginUser.pickedProps())
  })
)

//Specificic endpoints middlewares
authMiddleware.post(
  "/refreshToken",
  middlewareHandler(async (req: Request) => {
    await validatorDto(RefreshToken, req.body, RefreshToken.pickedProps())
  })
)

authMiddleware.post(
  "/forgotPassword",
  middlewareHandler(async (req: Request) => {
    await validatorDto(ForgotPassword, req.body, ForgotPassword.pickedProps())
  })
)

authMiddleware.post(
  "/saveNewPassword",
  middlewareHandler(async (req: Request) => {
    await validatorDto(SaveNewPassword, req.body, SaveNewPassword.pickedProps())
  })
)

authMiddleware.post(
  "/verifyEmail",
  middlewareHandler(async (req: Request) => {
    await validatorDto(VerifyEmail, req.body, VerifyEmail.pickedProps())
  })
)

authMiddleware.post(
  "/resendVerifyToken",
  middlewareHandler(async (req: Request) => {
    await validatorDto(
      ResendVerifyToken,
      req.body,
      ResendVerifyToken.pickedProps()
    )
  })
)
