import { DataSource, DataSourceOptions } from 'typeorm';
import { config } from 'dotenv';

config();

const { DB_TYPE, DB_HOST, DB_USERNAME, DB_PASSWORD, DB_PORT, DB_DATABASE } =
  process.env;

console.log(__dirname + '/src/**/*.entity.{ts,js}');

export default new DataSource({
  type: DB_TYPE,
  host: DB_HOST,
  port: Number(DB_PORT),
  username: DB_USERNAME,
  password: DB_PASSWORD,
  database: DB_DATABASE,
  entities: [__dirname + '/src/**/*.entity.{ts,js}'],
  migrations: [__dirname + '/src/migrations/*{.ts,.js}'],
  cli: {
    migrationsDir: __dirname + '/src/migrations'
  }
} as DataSourceOptions);
