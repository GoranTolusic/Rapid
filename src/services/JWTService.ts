import { Service } from "typedi"
import { User } from "../entities/User"
import jwt from "jsonwebtoken"
import dotenv from "dotenv"
dotenv.config()

@Service()
class JWTService {
  generateToken(item: any, expire = true): string {
    const token = jwt.sign(
      item,
      String(process.env.JWT_SECRET),
      expire
        ? {
            expiresIn: process.env.JWT_EXPIRES || "1h",
          }
        : undefined
    )
    return token
  }

  verifyToken(token: string) {
    const decoded = jwt.verify(token, String(process.env.JWT_SECRET))
    return decoded
  }

  refreshToken(user: User): string {
    const token = jwt.sign(
      user,
      String(process.env.JWT_SECRET),
      process.env.JWT_REFRESH_EXPIRES
        ? { expiresIn: process.env.JWT_REFRESH_EXPIRES }
        : undefined
    )
    return token
  }
}

export default JWTService
