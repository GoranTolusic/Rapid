import { Request, Router } from "express"
import Container from "typedi"
import { routeHandler } from "../../start/routeHandler"
import TestController from "../controllers/TestController"

export const testRoutes = Router()
const testController = Container.get(TestController)

//prefix = test/
testRoutes.post(
  "/publicEncrypt",
  routeHandler((req: Request) => testController.publicEncrypt(req))
)

testRoutes.post(
  "/blockingRoute",
  routeHandler((req: Request) => testController.blockingRoute(req))
)

testRoutes.post(
  "/generateAesKey",
  routeHandler((req: Request) => testController.generateAesKey())
)

testRoutes.post(
  "/generateRsaKey",
  routeHandler((req: Request) => testController.generateRsaKey())
)

testRoutes.post(
  "/testMqttConnection",
  routeHandler((req: Request) => testController.testMqttConnection(req))
)
