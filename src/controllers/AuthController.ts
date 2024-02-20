import { Request } from "express"
import { Service } from "typedi"
import AuthService from "../services/AuthService"
import UserService from "../services/UserService"

@Service()
class AuthController {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService
  ) {}

  public async register(req: Request) {
    return await this.userService.create(req.body._validated)
  }

  public async login(req: Request) {
    return await this.authService.login(req.body)
  }

  public async verifyEmail(req: Request) {
    return await this.authService.verifyEmailToken(req.body._validated)
  }

  public async resendVerifyToken(req: Request) {
    return await this.authService.resendVerifyToken(req.body._validated)
  }

  public async refreshToken(req: Request) {
    return await this.authService.refreshToken(req.body)
  }

  public async forgotPassword(req: Request) {
    return await this.authService.forgotPassword(req.body._validated)
  }

  public async saveNewPassword(req: Request) {
    return await this.authService.saveNewPassword(req.body._validated)
  }
}

export default AuthController
