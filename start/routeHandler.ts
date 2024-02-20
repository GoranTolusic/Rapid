import { Request, Response } from "express"
import { errorHandler } from "./errorHandler"

export const routeHandler =
  (handler: any) => async (req: Request, res: Response) => {
    try {
      const result = await handler(req)
      res.status(200).json(result)
    } catch (error: any) {
      error = errorHandler(error)
      res.status(error.status || 500).json({
        message: "Something went wrong",
        error: error,
        additionalInfo: JSON.stringify(error)
      })
    }
  }
