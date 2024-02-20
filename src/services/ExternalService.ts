import { Service } from "typedi"
import got from "got"
import { ObjectLiteral } from "typeorm"
import { InternalServerError } from "@tsed/exceptions"
import { Logger } from "../helpers/logger"

@Service()
class ExternalService {
  public options: ObjectLiteral

  constructor() {
    this.options = {
      headers: {
        "Content-Type": "application/json",
      },
    }
  }

  public setHeaders(headers: ObjectLiteral) {
    Object.assign(this.options.headers, headers)
  }

  public setBodyPayload(body: ObjectLiteral) {
    this.options.json = body
  }

  public setQueryParams(params: ObjectLiteral) {
    this.options.searchParams = params
  }

  public async post(url: string, statusCode = false) {
    let response
    try {
      response = await got.post(url, this.options)
    } catch (error: any) {
      Logger.error(
        "External request error for url: " +
          url +
          " Request structure: " +
          JSON.stringify(this.options)
      )

      let message: string | number =
        "External request error Error: " + JSON.stringify(error.message)
      if (statusCode && error.response?.statusCode) {
        message = error.response.statusCode
      }

      throw new InternalServerError(JSON.stringify(message))
    }
    return response.body ? JSON.parse(response.body) : {}
  }

  public async get(url: string, statusCode = false) {
    let response
    try {
      response = await got.get(url, this.options)
    } catch (error: any) {
      Logger.error(
        "External request error for url: " +
          url +
          " Request structure: " +
          JSON.stringify(this.options)
      )

      let message: string | number =
        "External request error Error: " + JSON.stringify(error.message)
      if (statusCode && error.response?.statusCode) {
        message = error.response.statusCode
      }

      throw new InternalServerError(JSON.stringify(message))
    }
    return response.body ? JSON.parse(response.body) : {}
  }

  public async patch(url: string, statusCode = false) {
    let response
    try {
      response = await got.patch(url, this.options)
    } catch (error: any) {
      Logger.error(
        "External request error for url: " +
          url +
          " Request structure: " +
          JSON.stringify(this.options)
      )

      let message: string | number =
        "External request error Error: " + JSON.stringify(error.message)
      if (statusCode && error.response?.statusCode) {
        message = error.response.statusCode
      }

      throw new InternalServerError(JSON.stringify(message))
    }
    return response.body ? JSON.parse(response.body) : {}
  }

  public async put(url: string, statusCode = false) {
    let response
    try {
      response = await got.put(url, this.options)
    } catch (error: any) {
      Logger.error(
        "External request error for url: " +
          url +
          " Request structure: " +
          JSON.stringify(this.options)
      )

      let message: string | number =
        "External request error Error: " + JSON.stringify(error.message)
      if (statusCode && error.response?.statusCode) {
        message = error.response.statusCode
      }

      throw new InternalServerError(JSON.stringify(message))
    }
    return response.body ? JSON.parse(response.body) : {}
  }

  public async delete(url: string, statusCode = false) {
    let response
    try {
      response = await got.delete(url, this.options)
    } catch (error: any) {
      Logger.error(
        "External request error for url: " +
          url +
          " Request structure: " +
          JSON.stringify(this.options)
      )
      let message: string | number =
        "External request error Error: " + JSON.stringify(error.message)
      if (statusCode && error.response?.statusCode) {
        message = error.response.statusCode
      }

      throw new InternalServerError(JSON.stringify(message))
    }
    return response.body ? JSON.parse(response.body) : {}
  }
}

export default ExternalService
