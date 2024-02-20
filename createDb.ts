import { Pool } from 'pg'
import dotenv from 'dotenv'
dotenv.config()

const connection = new Pool({
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: 'postgres',
});

const dbName = process.env.DB_DATABASE

connection.query(`SELECT 1 FROM pg_database WHERE datname = '${dbName}'`, (err, res) => {
    if (err) {
        console.log(err)
        connection.end()
    } else {
        if (res.rows.length > 0) {
            console.log(`Database '${dbName}' already exists, nothing to create.`)
            connection.end()
        } else {
            console.log(`Creating database '${dbName}'...`)
            connection.query(`CREATE DATABASE "${dbName}" ENCODING 'UTF8'`, (err, res) => {
                if (err) {
                    console.log(err)
                } else {
                    console.log(`Database '${dbName}' has been created with UTF8 encoding`)
                }
                connection.end()
            });
        }
    }
});
