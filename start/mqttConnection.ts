import * as mqtt from "mqtt"
import { Logger } from "../src/helpers/logger"

const options = {
    clean: true,
    connectTimeout: Number(process.env.MQTT_CONNECT_TIMEOUT) || 10000,
    username: process.env.MQTT_USERNAME || "",
    password: process.env.MQTT_PASSWORD || "",
}

const connectUrl = process.env.MQTT_CONNECT_URL || "mqtt://localhost:1883/mqtt"
export const mqttClient = mqtt.connect(connectUrl, options)

mqttClient.on("connect", function () {
    console.log("\x1b[32m", `Successfully connected to mqtt client`, "\x1b[0m")
})

mqttClient.on("error", (error: any) => {
    Logger.error("MQTT Connection failed: " + JSON.stringify(error))
})

mqttClient.on("message", (topic: string, payload) => {
    //Process payload....
})
