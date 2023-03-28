import { DataSourceOptions } from 'typeorm'
import dotenv from 'dotenv'

dotenv.config()
export function getConfig() {
  return {
    type: 'mysql',
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT),
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    entities: [__dirname + '/**/*.entity{.ts,.js}'],
    synchronize: false,
    migrationsRun: true,
    logging: true,
    migrations: [__dirname + '/../../typeorm-migrations/*.{ts,js}'],
  } as DataSourceOptions
}
