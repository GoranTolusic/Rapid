import { User } from "../../src/entities/User";

declare global{
    namespace Express {
        interface Request {
            loggedUser: User
        }
    }
}

export type EngineType = 'facebook' | 'whatsapp' | 'default' | 'imessage' | 'sms' | 'google-messenger'