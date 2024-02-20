import { Request } from "express"
import { Service } from "typedi"
import HashService from "../services/HashService"
import { BadRequest } from "@tsed/exceptions"
import * as mqtt from "mqtt"
import { Logger } from "../helpers/logger"

@Service()
class TestController {
  constructor(private readonly hashService: HashService) {}

  public async publicEncrypt(req: Request) {
    if (!req.body.data || !req.body.aesKey)
      throw new BadRequest("data and publicKey is missing in request payload")
    return {
      data: this.hashService.aesEncrypt(
        req.body.data,
        Buffer.from(req.body.aesKey, "base64")
      ),
    }
  }

  public async blockingRoute(req: Request) {
    let counter = 0
    for (let i = 0; i < 20_000_000_000; i++) {
      counter++
    }
    return { counter: counter }
  }

  public async generateAesKey() {
    return { key: this.hashService.generateAesKey() }
  }

  public async generateRsaKey() {
    return this.hashService.generateRSAKeys(2048)
  }

  public async testMqttConnection(req: Request) {
    if (!req.body.password || !req.body.username || !req.body.topic)
      throw new BadRequest("Missing username and password props")
    const options = {
      clean: true,
      connectTimeout: Number(process.env.MQTT_CONNECT_TIMEOUT) || 10000,
      username: req.body.username,
      password: req.body.password,
    }

    const connectUrl =
      process.env.MQTT_CONNECT_URL || "mqtt://localhost:1883/mqtt"
    const mqttClient = mqtt.connect(connectUrl, options)

    mqttClient.on("connect", function () {
      console.log(
        "\x1b[32m",
        `Successfully connected to mqtt client with test users`,
        "\x1b[0m"
      )
      if (req.body.subscribe) mqttClient.subscribe(req.body.topic, { qos: 2 })
      if (req.body.publish)
        mqttClient.publish(
          req.body.topic,
          "Hello world!",
          { qos: 2 },
          (err?: Error) => {
            if (err) {
              Logger.error("Failed to publish")
            } else {
              Logger.info("Message published")
            }
          }
        )
    })

    mqttClient.on("message", async (topic: string, messageBuffer: Buffer) => {
      console.log(topic)
      console.log(messageBuffer.toString())
    })

    mqttClient.on("error", (error: any) => {
      Logger.error(
        "MQTT Connection failed with test users: " + JSON.stringify(error)
      )
    })
  }
}

export default TestController
