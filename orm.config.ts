import { DataSource } from 'typeorm';
export default new DataSource({
  type: 'mysql',
  host: 'containers-us-west-80.railway.app',
  port: 5873,
  username: 'root',
  password: '59RWxKOlTEX5Ma2geMVn',
  database: 'railway',
  entities: ['./src/../**/*.entity.ts', './src/../**/*.entity.js'],
  migrations: ['./src/database/migrations/*{.ts,.js}'],
});
