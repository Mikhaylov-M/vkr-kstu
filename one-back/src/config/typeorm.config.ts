import { DataSource } from 'typeorm';
import { join } from 'path';

// Конфигурация DataSource
export const AppDataSource = new DataSource({
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'postgres',
  password: 'sUx7hvdp22YhPATdoXu3',
  database: 'postgres',
  entities: [
    join(__dirname, '../', '**', '*.entity.{ts,js}')
  ],
  synchronize: true
})