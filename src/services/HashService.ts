import { Service } from "typedi"
import * as bcrypt from "bcrypt"
import * as crypto from "crypto"

@Service()
class HashService {
  async hash(string: string): Promise<string> {
    const salt = await bcrypt.genSalt()
    return await bcrypt.hash(string, salt)
  }

  async comparePasswords(password: string, hash: string) {
    return await bcrypt.compare(password, hash)
  }

  generateRSAKeys(moduluesLength: number | null): {
    publicKey: string
    privateKey: string
  } {
    const { publicKey, privateKey } = crypto.generateKeyPairSync("rsa", {
      modulusLength: moduluesLength || 2048,
      publicKeyEncoding: {
        type: "spki",
        format: "pem",
      },
      privateKeyEncoding: {
        type: "pkcs8",
        format: "pem",
      },
    })

    return {
      publicKey,
      privateKey,
    }
  }

  generateAesKey() {
    return crypto.randomBytes(32).toString("base64")
  }

  publicEncrypt(data: any, key: string) {
    return crypto
      .publicEncrypt(
        {
          key: key,
          padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
          //oaepHash: "sha256",
        },
        Buffer.from(data, "utf8")
      )
      .toString("base64")
  }

  privateDecrypt(data: any, key: string) {
    return crypto
      .privateDecrypt(
        {
          key: key as string,
          padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
          oaepHash: "sha256",
        },
        Buffer.from(data, "base64")
      )
      .toString("utf8")
  }

  aesEncrypt(data: string, key: Buffer) {
    const iv = crypto.randomBytes(12)
    const cipher = crypto.createCipheriv("aes-256-gcm", key, iv)
    const encrypted = Buffer.concat([
      cipher.update(data, "utf8"),
      cipher.final(),
    ])
    const tag = cipher.getAuthTag()
    return Buffer.concat([iv, tag, encrypted]).toString("base64")
  }

  aesDecrypt(encryptedText: string, key: Buffer) {
    const data = Buffer.from(encryptedText, "base64")
    const iv = data.subarray(0, 12)
    const tag = data.subarray(12, 28)
    const text = data.subarray(28)
    const decipher = crypto.createDecipheriv("aes-256-gcm", key, iv)
    decipher.setAuthTag(tag)
    const decrypted = Buffer.concat([decipher.update(text), decipher.final()])
    return decrypted.toString("utf8")
  }
}

export default HashService
