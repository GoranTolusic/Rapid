import { Router } from "express"
import { middlewareHandler } from "../../start/middlewareHandler"
import { devEnvironment } from "../helpers/devEnvironment"

export const testMiddleware = Router()

//prefix = test/

//global middleware for all test/ routes
testMiddleware.use(middlewareHandler(devEnvironment))
