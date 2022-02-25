import { TypeOrmModuleOptions } from '@nestjs/typeorm';

const pgConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE_NAME,
  entities: [__dirname + '/../**/*.entity{.ts,.js}'],
  migrations: ['migration/*{.ts,.js}'],
  cli: {
    migrationsDir: 'migration',
  },
  synchronize: true, // TODO: set false in production
};

export default pgConfig;
