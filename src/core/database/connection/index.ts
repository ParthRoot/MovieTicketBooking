import { databaseConf } from '../config';
import * as path from 'path';
import { DataSource, DataSourceOptions } from 'typeorm';
import { Auth, User } from '../entity';

export const migrationFolder = path.join(
  __dirname,
  '../migrations/**/*.{ts,js}',
);
export const entitiesFolder = path.join(__dirname, '../entity/**/*.{ts,js}');
export const ormConfig: DataSourceOptions = {
  replication: {
    master: {
      host: databaseConf.DB_HOST(),
      port: databaseConf.DB_PORT(),
      username: databaseConf.DB_USERNAME(),
      password: databaseConf.DB_PASSWORD(),
      database: databaseConf.DB_NAME(),
    },
    slaves: [],
  },
  type: databaseConf.DB_TYPE(),
  entities: [entitiesFolder],
  subscribers: [],
  migrations: [migrationFolder],
  migrationsTableName: 'migrations',
  logging: 'all',
  logger: databaseConf.LOG_LEVEL() as any,
  extra: {
    ssl: {
      rejectUnauthorized: false,
    },
  },
};

export const PostgresProviderToken = 'PG_DATASOURCE';
export const AppDataSource = new DataSource(ormConfig);
