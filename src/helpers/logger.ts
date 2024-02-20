import winston from "winston"

export class Logger {
  static getLogger() {
    return winston.createLogger({
      level: "debug",
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
      ),
      transports: [new winston.transports.Console()],
    })
  }

  public static info(text: string) {
    if (process.env.INFO_LOGS == "true") this.getLogger().info(text)
  }

  public static error(text: string) {
    if (process.env.ERROR_LOGS == "true") this.getLogger().error(text)
  }

  public static debug(text: string) {
    this.getLogger().debug(text)
  }
}
