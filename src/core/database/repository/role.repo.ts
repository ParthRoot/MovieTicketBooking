import { Injectable, Inject } from "@nestjs/common";
import { Repository, DataSource } from "typeorm";
import { PostgresProviderToken } from "../connection";
import { Role } from "../entity";
import { handleError } from "@core/utils";

@Injectable()
export class RoleRepository extends Repository<Role> {
  constructor(@Inject(PostgresProviderToken) protected dataSource: DataSource) {
    super(Role, dataSource.createEntityManager());
  }

  findRoleByRoleId(roleId: string) {
    return handleError(async () => {
      return await this.findOne({ where: { role_id: roleId } });
    });
  }
}
