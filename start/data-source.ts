import "reflect-metadata"
import { DataSource } from "typeorm"
import dotenv from "dotenv"
import path, { join } from "path"

dotenv.config()
const entityPath = path.join(__dirname, '../src', 'entities')

export const AppDataSource = new DataSource({
  type: "postgres",
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  synchronize: false, //WARNING: seting syncrhonize to true can cause potentialy data loss from Db, leave this at false
  logging: false,
  entities: [join(entityPath, '**', '*.{ts,js}')],
  migrations: [],
  subscribers: [],
})

AppDataSource.initialize()
  .then(() => {
    console.log("\x1b[32m", `Connected to database on ${process.env.DB_HOST}:${process.env.DB_PORT}`, '\x1b[0m')
  })
  .catch((error) => console.log(error))
