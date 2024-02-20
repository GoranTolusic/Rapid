import { Forbidden } from "@tsed/exceptions"

//check in environment is development
export const devEnvironment = async () => {
  if (process.env.ENVIRONMENT !== "develop")
    throw new Forbidden("Route is allowed only in develop mode")
}
