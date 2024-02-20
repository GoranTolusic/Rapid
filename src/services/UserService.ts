import { Service } from "typedi"
import { AppDataSource } from "../../start/data-source"
import { User } from "../entities/User"
import CreateUser from "../validationTypes/CreateUser"
import { Forbidden, MethodNotAllowed, NotFound } from "@tsed/exceptions"
import HashService from "./HashService"
import AuthService from "./AuthService"
import UpdateUser from "../validationTypes/UpdateUser"
import { UserWaitList } from "../entities/UserWaitList"
import { transporter } from "../helpers/transporter"
import { Logger } from "../helpers/logger"
import ResetPassword from "../validationTypes/ResetPassword"

@Service()
class UserService {
  public userRepository
  public waitListRepository
  constructor(
    private hashService: HashService,
    private authService: AuthService
  ) {
    this.userRepository = AppDataSource.getRepository(User)
    this.waitListRepository = AppDataSource.getRepository(UserWaitList)
  }

  async handleWaitList(email: string) {
    //check if user with same email exists
    const findIfExists = await this.waitListRepository.findOneBy({
      email: email,
    })
    if (!findIfExists)
      await this.waitListRepository.save({
        email: email,
        createdAt: Date.now(),
      })
    return true
  }

  async create(inputs: CreateUser) {
    const response = {
      message: "Verification email was sent",
    }
    //check if user with same email exists
    const findIfEmailExists = await this.userRepository.findOneBy({
      email: inputs.email,
    })
    if (findIfEmailExists) {
      if (!findIfEmailExists.verified) {
        await this.authService.resendVerifyToken({
          email: findIfEmailExists.email,
          verifyToken: inputs.verifyToken,
          updatedAt: Date.now(),
          verifyExpiresAt: inputs.verifyExpiresAt,
        })
      }
      return response
    }

    //check if user with same username exists
    const findIfUsernameExists = await this.userRepository.findOneBy({
      username: inputs.username,
    })
    if (findIfUsernameExists) throw new Forbidden("Username already exists")

    //check current users count
    const maxUsers = await this.userRepository.count()
    if (maxUsers >= Number(process.env.MAX_USERS)) {
      if (process.env.WAITLIST_USERS) {
        await this.handleWaitList(inputs.email)
      }
      Logger.error("Maximum numbers of users reached")
      throw new MethodNotAllowed(
        "Thank you for downloading application. Due to overwhelming demand we are currently at capacity. Please try again periodically as we open up additional users."
      )
    }

    //hash password
    inputs.password = await this.hashService.hash(inputs.password)

    //insert user
    const created = await this.userRepository.save(inputs)

    //send email for verifying (check the console for generated link to verify account :P)
    this.authService.verifyMailEmail(
      created,
      this.authService.getApplicationName('Person')
    )

    return response
  }

  async get(id: number): Promise<User> {
    const user = await this.userRepository.findOne({
      where: {
        id: id,
      },
    })
    if (!user) {
      Logger.error("User with id " + id + " not found")
      throw new NotFound("User Not Found")
    }
    return user
  }

  async delete(id: number): Promise<{ message: string }> {
    //Delete it from database
    await this.userRepository.delete(id)
    Logger.info("User with id " + id + " successfuly deleted")
    return { message: "successfuly deleted" }
  }

  async update(id: number, body: UpdateUser): Promise<User> {
    const user = await this.get(id)
    Object.assign(user, body)
    return await this.userRepository.save(user)
  }

  async notifyWaitListedUsers() {
    const maxRegisteredUsers = await this.userRepository.count()
    if (Number(process.env.MAX_USERS) > maxRegisteredUsers) {
      const countUsersToNotify =
        Number(process.env.MAX_USERS) - maxRegisteredUsers
      const batchSize = Number(process.env.WAITLIST_BATCH_SIZE)
      if (countUsersToNotify > batchSize) {
        let recordCounter = 0
        const numBatches = Math.ceil(countUsersToNotify / batchSize)
        for (let batchNum = 0; batchNum < numBatches; batchNum++) {
          if (countUsersToNotify > batchNum) {
            const offset = batchNum * batchSize
            const limit = Math.min(batchSize, countUsersToNotify - offset)
            const queryResult = await this.fetchUsersFromWaitList(limit, offset)
            recordCounter = recordCounter + queryResult.length
            await this.sendEmailToWaitListUsers(queryResult)
          }
        }
        await this.removeUsersFromWaitListBatch(recordCounter)
      } else {
        const waitListRecords = await this.fetchUsersFromWaitList(
          countUsersToNotify,
          0
        )
        await this.sendEmailToWaitListUsers(waitListRecords)
        const mapped = waitListRecords.map((item) => item.email)
        //Maybe change this into removeUsersFromWaitListBatch method and remove removeUsersFromWaitList method from code
        await this.removeUsersFromWaitList(mapped)
      }
    }
  }

  async fetchUsersFromWaitList(limit: number, offset: number) {
    return await this.waitListRepository.find({
      order: {
        id: "ASC",
      },
      take: limit,
      skip: offset,
    })
  }

  async removeUsersFromWaitListBatch(limit: number) {
    const subquery = `SELECT id FROM users_waitlist ORDER BY id ASC LIMIT ${limit}`
    await this.waitListRepository
      .createQueryBuilder()
      .delete()
      .from(UserWaitList)
      .where("id IN (" + subquery + ")")
      .execute()
  }

  async removeUsersFromWaitList(emails: Array<string>) {
    if (emails.length)
      await this.waitListRepository
        .createQueryBuilder()
        .delete()
        .from(UserWaitList)
        .where("email IN (:...emails)", { emails: emails })
        .execute()
  }

  async sendEmailToWaitListUsers(waitListRecords: UserWaitList[]) {
    for (const oneResult of waitListRecords) {
      await this.waitListEmail(oneResult.email)
    }
  }

  async waitListEmail(email: string) {
    // send mail with defined transport object
    const info = await transporter.sendMail({
      from:
        process.env.EMAIL_SMTP_FROM ?? '"Sunbird team" <sunbird@example.com>',
      to: email,
      subject: "Register yourself on Sunbird application", // Subject line
      text: "Hello there! Your wait is over! We've just released a limited number of new slots for Sunbird! Don't miss out – click the link below to download and sign up!", // plain text body
      html: "<p>Hello there!<br>Your wait is over!<br>We've just released a limited number of new slots for Sunbird! Don't miss out – click the link below to download and sign up!</p>", // html body
    })

    Logger.info("Message sent: %s " + info.messageId)
  }

  async resetPassword(
    id: number,
    body: ResetPassword
  ): Promise<{ message: string }> {
    try {
      const user = await this.authService.getUserWithSensitiveData(
        { id: id },
        "id",
        id
      )

      //check if password matches with hashed one
      const matches = await this.hashService.comparePasswords(
        body.currentPassword,
        user?.password || ""
      )

      if (!matches) {
        Logger.error("Unable to reset password for user with id: " + id)
        throw new MethodNotAllowed("Unable to reset password!")
      }

      //hash new password
      const newPassword = await this.hashService.hash(body.newPassword)

      Object.assign(user, { password: newPassword, updatedAt: body.updatedAt })
      await this.userRepository.save(user)
      Logger.info("Password successfuly changed")
      return { message: "Password successfuly changed" }
    } catch (e: any) {
      throw new MethodNotAllowed("Unable to reset password!")
    }
  }

}

export default UserService
