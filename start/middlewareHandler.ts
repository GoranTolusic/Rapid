import { Request, Response, NextFunction } from "express"
import { errorHandler } from "./errorHandler"

export const middlewareHandler =
  (handler: any) => async (req: Request, res: Response, next: NextFunction) => {
    try {
      await handler(req)
      next()
    } catch (error: any) {
      error = errorHandler(error)
      res.status(error.status || 500).json({
        message: "Request error!",
        error: error,
      })
    }
  }
