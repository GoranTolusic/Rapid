import { Express } from "express"
import { authRoutes } from "./auth"
import { testRoutes } from "./test"
import { userRoutes } from "./user"

export const routeRegistry = (app: Express) => {
  app.use("/auth", authRoutes)
  app.use("/test", testRoutes)
  app.use("/user", userRoutes)
}
