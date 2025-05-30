import { Global, Module } from "@nestjs/common";
import { AppDataSource, PostgresProviderToken } from ".";
import { RoleRepository, UserRepository } from "./repository";

const SERVICES = [
  {
    provide: PostgresProviderToken,
    useFactory: () => {
      return AppDataSource.initialize();
    },
  },
];

const PG_REPOSITORIES = [UserRepository, RoleRepository];

@Global()
@Module({
  providers: [...SERVICES, ...PG_REPOSITORIES],
  exports: [PostgresProviderToken, ...PG_REPOSITORIES],
})
export class DatabaseModule {}
