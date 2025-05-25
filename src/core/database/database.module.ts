import { Global, Module } from '@nestjs/common';
import { AppDataSource, PostgresProviderToken } from '.';

const SERVICES = [
  {
    provide: PostgresProviderToken,
    useFactory: () => {
      return AppDataSource.initialize();
    },
  },
];

const PG_REPOSITORIES = [];

@Global()
@Module({
  providers: [...SERVICES, ...PG_REPOSITORIES],
  exports: [PostgresProviderToken, ...PG_REPOSITORIES],
})
export class DatabaseModule {}
