import { google } from "googleapis"
import { Logger } from "./logger"
import * as fs from "fs"

const googleServiceKey = process.cwd() + '/service_account_key.json'

if (!fs.existsSync(googleServiceKey)) {
  throw new Error('service_account_key.json is missing in root folder')
} 
const auth = new google.auth.GoogleAuth({
    keyFile: googleServiceKey,
    scopes: [] //See the google documentation of possible scopes
});

export const getGoogleAccessToken = async function(): Promise<string | null | undefined> {
    try {
        return await auth.getAccessToken() || '';
    } catch (error: any) {
        Logger.error('Error getting google access token: ' + JSON.stringify(error))
        throw error;
    }
}