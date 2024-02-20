export const envValidation = () => {
  const e = process.env
  let error = false

  //WARNINGS
  if (!e.EMAIL_SMTP_HOST ||
      !e.EMAIL_SMTP_PORT ||
      !e.EMAIL_SMTP_USER ||
      !e.EMAIL_SMTP_PASSWORD ||
      !e.EMAIL_SMTP_FROM) console.error("\x1b[33m", 'Warning: Missing some of EMAIL env variables', '\x1b[0m')
  if (!e.JWT_REFRESH_EXPIRES) console.error("\x1b[33m", 'Warning: JWT_REFRESH_EXPIRES env variable is empty. Leave it empty if you want unlimited expiry duration for your refresh tokens', '\x1b[0m')
  if (!e.WAITLIST_USERS) console.error("\x1b[33m", 'Warning: WAITLIST_USERS env variable is empty', '\x1b[0m')
  if (!e.MAX_LOGIN_RETRY) console.error("\x1b[33m", 'Warning: MAX_LOGIN_RETRY env variable is empty. Default values will be used', '\x1b[0m')
  if (!e.LOGIN_RESTRICTION_TIMEOUT) console.error("\x1b[33m", 'Warning: LOGIN_RESTRICTION_TIMEOUT env variable is empty. Default values will be used', '\x1b[0m')
  if (e.DEBUG_ERRORS) console.error("\x1b[33m", 'Warning: DEBUG_ERRORS env variable is not empty. Your error http responses may leak sensitive informations.', '\x1b[0m')
  console.error("\x1b[33m", 'Warning: ERROR_LOGS env variable set to ' + e.ERROR_LOGS, '\x1b[0m')
  console.error("\x1b[33m", 'Warning: INFO_LOGS env variable set to ' + e.INFO_LOGS, '\x1b[0m')
  if (!e.VERIFY_TOKEN_EXPIRE) console.error("\x1b[33m", 'Warning: VERIFY_TOKEN_EXPIRE env variable is empty. Default values will be used', '\x1b[0m')
  if (!e.FORGOT_PASSWORD_EXPIRE) console.error("\x1b[33m", 'Warning: FORGOT_PASSWORD_EXPIRE env variable is empty. Default values will be used', '\x1b[0m')
  if (!e.MAX_FORGOT_PASSWORD_RETRY) console.error("\x1b[33m", 'Warning: MAX_FORGOT_PASSWORD_RETRY env variable is empty. Default values will be used', '\x1b[0m')
  if (!e.FORGOT_PASSWORD_RESTRICTION_TIMEOUT) console.error("\x1b[33m", 'Warning: FORGOT_PASSWORD_RESTRICTION_TIMEOUT env variable is empty. Default values will be used', '\x1b[0m')
  if (!e.FRONTEND_URL) console.error("\x1b[33m", 'Warning: FRONTEND_URL env variable is empty. Links generated in your sent emails will be undefined', '\x1b[0m')

  //Errors
  if (!e.DB_HOST ||
      !e.DB_PORT ||
      !e.DB_DATABASE ||
      !e.DB_USERNAME ||
      !e.DB_PASSWORD ||
      !e.DB_CONNECTION) {
      console.error("\x1b[31m", 'Error: Missing some of DB env variables', '\x1b[0m')
      error = true
  }

  if (!e.HOST) {
      console.error("\x1b[31m", 'Error: Missing HOST env variable', '\x1b[0m')
      error = true
  }

  if (!e.PORT) {
      console.error("\x1b[31m", 'Error: Missing HOST env variable', '\x1b[0m')
      error = true
  }

  if (!e.ENVIRONMENT || !['production', 'develop'].includes(e.ENVIRONMENT)) {
      console.error("\x1b[31m", 'Error: ENVIRONMENT env variable missing or invalid values are defined. Allowed values: "production", "develop"', '\x1b[0m')
      error = true
  }

  if (!e.CLIENT_KEY) {
    console.error("\x1b[31m", "Error: Missing CLIENT_KEY env variable", "\x1b[0m")
    error = true
  }

  if (!e.CORS_ORIGIN) {
      console.error("\x1b[31m", 'Error: Missing CORS_ORIGIN env variable', '\x1b[0m')
      error = true
  }

  if (!e.JWT_SECRET) {
      console.error("\x1b[31m", 'Error: Missing JWT_SECRET env variable', '\x1b[0m')
      error = true
  }

  if (!e.JWT_EXPIRES) {
      console.error("\x1b[31m", 'Error: Missing JWT_EXPIRES env variable. Check env.examples for value examples/options', '\x1b[0m')
      error = true
  }

  if (e.WAITLIST_USERS) {
      if (!e.MAX_USERS ||
          !e.WAITLIST_BATCH_SIZE ||
          !e.WAITLIST_SCRIPT_INTERVAL) {
          console.error("\x1b[31m", 'Error: You need to specify all env variables for waitlist users: MAX_USERS,WAITLIST_BATCH_SIZE,WAITLIST_SCRIPT_INTERVAL', '\x1b[0m')
          error = true
      }
  }

  if (!e.MQTT_USERNAME ||
      !e.MQTT_PASSWORD ||
      !e.MQTT_CONNECT_URL ||
      !e.MQTT_CONNECT_TIMEOUT) {
      console.error("\x1b[31m", 'Error: Missing some of mqtt env variables. Please check env.examples for options', '\x1b[0m')
      error = true
  }

  return error

};