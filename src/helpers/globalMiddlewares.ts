import { Express } from "express"
import cors from "cors"
import { middlewareHandler } from "../../start/middlewareHandler"
import { authenticateRequest } from "./authenticateRequest"

export const globalMiddlewares = (app: Express) => {
  const environment = process.env.ENVIRONMENT
  app.use(
    cors({
      origin: (environment == 'production') ? process.env.CORS_ORIGIN : '*',
    })
  )
  app.use(middlewareHandler(authenticateRequest))
}
