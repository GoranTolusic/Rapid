import { User } from "../../src/entities/User";

declare global{
    namespace Express {
        interface Request {
            loggedUser: User
        }
    }
}

export type MethodTypes = 'post' | 'patch' | 'get' | 'put' | 'delete'