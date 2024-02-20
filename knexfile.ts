import dotenv from 'dotenv';
import type { Knex } from "knex";
dotenv.config();

const dbCredentials = {
  host : process.env.DB_HOST,
  port : Number(process.env.DB_PORT),
  user : process.env.DB_USERNAME,
  password : process.env.DB_PASSWORD,
  database : process.env.DB_DATABASE
}


const config: { [key: string]: Knex.Config } = {
  development: {
    client: process.env.DB_CONNECTION,
    connection: dbCredentials,
    seeds : {
      directory: './database/seeds',
      extension: 'ts'
    },
    migrations : {
      directory : 'database/migrations',
      extension: 'ts'
    }
  },

  staging: {
    client: process.env.DB_CONNECTION,
    connection: dbCredentials,
    seeds : {
      directory: './database/seeds',
      extension: 'ts'
    },
    migrations : {
      directory : 'database/migrations',
      extension: 'ts'
    }
  },

  production: {
    client: process.env.DB_CONNECTION,
    connection: dbCredentials,
    seeds : {
      directory: './database/seeds',
      extension: 'ts'
    },
    migrations : {
      directory : 'database/migrations',
      extension: 'ts'
    }
  },

};

module.exports = config;
