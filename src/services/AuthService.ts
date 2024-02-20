import {
  Forbidden,
  MethodNotAllowed,
  NotFound,
  Unauthorized,
} from "@tsed/exceptions"
import { Service } from "typedi"
import { AppDataSource } from "../../start/data-source"
import { User } from "../entities/User"
import HashService from "./HashService"
import JWTService from "./JWTService"
import { omit } from "lodash"
import { transporter } from "../helpers/transporter"
import { Logger } from "../helpers/logger"
import ForgotPassword from "../validationTypes/ForgotPassword"
import SaveNewPassword from "../validationTypes/SaveNewPassword"
import VerifyEmail from "../validationTypes/VerifyEmail"
import ResendVerifyToken from "../validationTypes/ResendVerifyToken"

@Service()
class AuthService {
  private userRepository

  constructor(
    private hashService: HashService,
    private jwtService: JWTService
  ) {
    this.userRepository = AppDataSource.getRepository(User)
  }

  async login(body: any): Promise<User> {
    //get user with Password
    const user = await this.getUserWithSensitiveData(
      { email: body.email },
      "email",
      body.email
    )

    if (user.restrictLoginUntil > Date.now()) {
      Logger.error("Too many login attempts for user ID: " + user.id)
      throw new Forbidden("Too many login attempts. Please try again later.")
    }

    //check if password matches with hashed one
    const matches = await this.hashService.comparePasswords(
      body.password,
      user?.password || ""
    )

    if (!matches) {
      await this.incrementLoginAttempts(body.email)
      throw new Unauthorized("Incorrect password. Try Again!")
    }

    if (!user?.verified) {
      Logger.error("Unverified user with ID: " + user.id)
      throw new Forbidden("Please, verify your email")
    }

    if (!user?.active) {
      Logger.error("Not active user with ID: " + user.id)
      throw new Forbidden("Account is not active")
    }

    //generate accessToken
    const accessToken = this.jwtService.generateToken(
      omit(user, ["password", "verifyToken", "refreshToken"])
    )

    //generate refresh token if not exists on current user
    if (!user.refreshToken) {
      const refreshToken = this.jwtService.refreshToken(
        omit(user, ["password", "verifyToken", "refreshToken"])
      )
      //Assign new values to existing user
      Object.assign(user, { refreshToken: refreshToken })
      await this.userRepository.save(user)
    }

    Object.assign(user, { accessToken: accessToken })
    Logger.info(
      "Access token obtained. Successful login for user with ID: " + user.id
    )
    return omit(user, ["password", "verifyToken"])
  }

  private incrementLoginAttempts = async (email: string) => {
    const user = await this.userRepository.findOneBy({ email })
    if (!user) {
      return
    }

    const maxLoginRetry = Number(process.env.MAX_LOGIN_RETRY) || 5
    const loginRestrictionTimeout =
      (Number(process.env.LOGIN_RESTRICTION_TIMEOUT) || 15) * 60 * 1000

    if (user?.loginAttempts >= maxLoginRetry) {
      Object.assign(user, {
        loginAttempts: 0,
        restrictLoginUntil: Date.now() + loginRestrictionTimeout,
      })
    } else {
      Object.assign(user, { loginAttempts: (user.loginAttempts ?? 0) + 1 })
    }

    return await this.userRepository.save(user)
  }

  async refreshToken(body: any): Promise<User> {
    const user = await this.getUserWithSensitiveData(
      { id: body.id },
      "id",
      body.id
    )
    if (
      !user.refreshToken ||
      body._validated.refreshToken !== user.refreshToken
    )
      throw new Unauthorized(`Invalid refresh token`)
    //verify expiration
    try {
      this.jwtService.verifyToken(body._validated.refreshToken)
    } catch (e) {
      //Clear expired refresh token from db
      Object.assign(user, { refreshToken: null })
      await this.userRepository.save(user)
      throw new Unauthorized("Refresh token expired")
    }
    //kreirati novi accesstoken
    const accessToken = this.jwtService.generateToken(
      omit(user, ["password", "verifyToken", "refreshToken"])
    )
    Object.assign(user, { accessToken: accessToken })
    Logger.info("Obtained new access token for user with ID: " + user.id)
    return omit(user, ["password", "verifyToken"])
  }

  async getUserWithSensitiveData(
    param: any,
    columnName: string,
    info: string | number
  ) {
    const user = await this.userRepository
      .createQueryBuilder("users")
      .addSelect("users.password")
      .addSelect("users.refreshToken")
      .addSelect("users.verifyToken")
      .addSelect("users.restrictLoginUntil")
      .where(`users.${columnName} = :${columnName}`, param)
      .getOne()
    if (!user) {
      Logger.error(`User with provided ${columnName} not found`)
      throw new NotFound(`User with provided ${columnName} not found`)
    }
    return user
  }

  async verifyEmailToken(params: VerifyEmail) {
    try {
      const user = await this.getUserWithSensitiveData(
        { uid: params.uid },
        "uid",
        params.uid
      )

      //check if user is already verified
      if (user.verified)
        throw new Error(`Already verified user with uid ${user.uid}`)
      //if token does not match with token from inputs we throw an error
      if (user.verifyToken !== params.verifyToken)
        throw new Error(`Invalid verifyToken for user with uid ${user.uid}`)
      //Check if verifyToken is expired
      if (user.verifyExpiresAt && Date.now() > user.verifyExpiresAt) {
        throw new Error(`verifyToken expired for user with uid ${user.uid}`)
      }
      user.verified = true
      user.active = true
      await this.userRepository.save(user)
    } catch (e: any) {
      Logger.error(e.message)
      throw new MethodNotAllowed(
        `Unable to change password. Please try again later!`
      )
    }
    return { message: "Email verified successfully" }
  }

  async verifyMailEmail(created: User, application: string) {
    try {
      // send mail with defined transport object
      const info = await transporter.sendMail({
        from:
          process.env.EMAIL_SMTP_FROM ?? '"Company team" <company@example.com>',
        to: `${created.email}`,
        subject: "Verify your email", // Subject line
        text: "Click on a link to verify your email?", // plain text body
        html: this.getVerifyEmailHtml(created, application), // html body
      })
      Logger.info("Email sent: %s " + info.messageId)
    } catch (e: any) {
      Logger.error(e.message)
    }
  }

  async forgotPasswordEmail(user: User, application: string) {
    try {
      // send mail with defined transport object
      const info = await transporter.sendMail({
        from:
          process.env.EMAIL_SMTP_FROM ?? '"Company team" <company@example.com>',
        to: user.email,
        subject: "Password Reset Request", // Subject line
        text: "Click the link to enter new password!", // plain text body
        html: this.getForgotPasswordHtml(user, application), // html body
      })
      Logger.info("Message sent: %s " + info.messageId)
    } catch (e: any) {
      Logger.error(e.message)
    }
  }

  getApplicationName(provider: string) {
    let formated
    switch (provider) {
      case "Company":
        formated = "Company Team"
        break
      case "Something":
        formated = "Person Team"
        break
      default:
        formated = "-"
    }
    return formated
  }

  getVerifyEmailHtml(user: User, application: string) {
    return `Hello <br><br>
    You registered an account on ${application}, before being able to use your account you need to verify that this is your email address by clicking here:<br>
    <b><a href="${process.env.FRONTEND_SUNBIRD_URL}/confirmEmail?verifyToken=${user.verifyToken}&uid=${user.uid}">Click to Verify</a></b><br><br>
    Thank you for using ${application}.<br>
    Best regards,<br>
    The ${application} Team`
  }

  getForgotPasswordHtml(user: User, application: string) {
    return `Dear ${user.name},<br>
    We received a request to reset the password for your account ${
      user.email
    } on ${application}. If you did not make this request, please ignore this email.<br>
    To reset your password, please click on the link below:<br>
    <b><a href="${
      process.env.FRONTEND_URL
    }/resetPassword?resetPasswordToken=${user.resetPasswordToken}&uid=${
      user.uid
    }">Reset Password Link</a></b><br><br>
    
    This link will expire in ${parseFloat(
      (Number(process.env.FORGOT_PASSWORD_EXPIRE || 3) / 60).toFixed(2)
    )} hours.<br><br>
    
    For security purposes, please do not share this email with anyone. If you suspect any unauthorized activity on your account, please notify us immediately.<br><br>
    
    Thank you for using ${application}.<br>
    Best regards,<br>
    The ${application} Team`
  }

  async resendVerifyToken(inputs: ResendVerifyToken) {
    try {
      const user = await this.getUserWithSensitiveData(
        { email: inputs.email },
        "email",
        inputs.email
      )

      Object.assign(user, { ...omit(inputs, ["email"]) })
      await this.userRepository.save(user)
      this.verifyMailEmail(user, this.getApplicationName('Person'))
    } catch (e: any) {
      Logger.error(e.message)
    }
    return { message: "Check your email for confirmation link" }
  }

  async forgotPassword(inputs: ForgotPassword) {
    const response = { message: "Check your email for reset password link" }
    try {
      const user = await this.getUserWithSensitiveData(
        { email: inputs.email },
        "email",
        inputs.email
      )

      if (
        user.resetPasswordExpiresAt &&
        user.resetPasswordExpiresAt > Date.now()
      )
        return response
      Object.assign(user, {
        ...omit(inputs, ["email"]),
        updatedAt: Date.now(),
      })
      await this.userRepository.save(user)
      this.forgotPasswordEmail(user, this.getApplicationName('Person'))
    } catch (e: any) {
      Logger.error(e.message)
    }
    return response
  }

  async saveNewPassword(inputs: SaveNewPassword) {
    try {
      const user = await this.getUserWithSensitiveData(
        { uid: inputs.uid },
        "uid",
        inputs.uid
      )

      const maxRetries = Number(process.env.MAX_FORGOT_PASSWORD_RETRY) || 5
      const restrictTimeout =
        Number(process.env.FORGOT_PASSWORD_RESTRICTION_TIMEOUT) || 15

      //Check if user has restriction on change passwowrd because of too many wrong attempts
      if (
        user.restrictForgotPasswordUntil &&
        user.restrictForgotPasswordUntil > Date.now()
      ) {
        throw new Error(
          `Too many change password attempts for user with uid ${user.uid}`
        )
      }

      //if everything fine reset restrict time
      Object.assign(user, { restrictForgotPasswordUntil: null })

      //if token does not match with token from inputs we increase one many wrong attempt by +1
      if (user.resetPasswordToken !== inputs.resetPasswordToken) {
        user.forgotPasswordAttempts++
        if (user.forgotPasswordAttempts >= maxRetries) {
          user.restrictForgotPasswordUntil =
            Date.now() + restrictTimeout * 60 * 1000
        }
        //save increased attempts and restriction date if is set
        await this.userRepository.save(user)
        throw new Error(
          `Invalid reset password token for user with uid ${user.uid}`
        )
      }

      //Check if reset password token is expired
      if (
        user.resetPasswordExpiresAt &&
        Date.now() > user.resetPasswordExpiresAt
      ) {
        throw new Error(
          `Reset password token expires for user with uid ${user.uid}`
        )
      }

      //hash password, removing resetPasswordToken, attempts and restrictions
      user.password = await this.hashService.hash(inputs.password)
      Object.assign(user, {
        resetPasswordToken: null,
        forgotPasswordAttempts: 0,
        resetPasswordExpiresAt: null,
      })

      await this.userRepository.save(user)
    } catch (e: any) {
      Logger.error(e.message)
      throw new MethodNotAllowed(
        `Unable to change password. Please try again later!`
      )
    }

    return { message: "Password changed successfully" }
  }
}

export default AuthService
