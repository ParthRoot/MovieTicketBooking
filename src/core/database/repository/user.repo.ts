import { Inject, Injectable } from "@nestjs/common";
import { DataSource, Repository } from "typeorm";
import { User } from "../entity";
import { PostgresProviderToken } from "../connection";
import { handleError } from "src/core/utils";

@Injectable()
export class UserRepository extends Repository<User> {
  constructor(@Inject(PostgresProviderToken) protected dataSource: DataSource) {
    super(User, dataSource.createEntityManager());
  }

  public findUserByEmail(email: string): Promise<User | null> {
    return handleError(async () => {
      return await this.findOne({
        where: { email },
        relations: { role: true },
      });
    });
  }

  public findUserByUserId(userId: string): Promise<User | null> {
    return handleError(async () => {
      return await this.findOne({
        where: { user_id: userId },
        relations: { role: true },
      });
    });
  }

  public saveUser(user: User): Promise<User> {
    return handleError(async () => {
      return await this.save(user);
    });
  }

  public updateJwtToken(user: User, jwtToken: string, expiry: Date) {
    return handleError(async () => {
      await this.update(
        { user_id: user?.user_id },
        { reset_password_token: jwtToken, reset_password_expires_at: expiry }
      );
    });
  }

  public findUserByToken(token: string): Promise<User | null> {
    return handleError(async () => {
      return await this.findOne({
        where: { reset_password_token: token, is_active: true },
      });
    });
  }

  public updateUserVerificationStatus(user: User) {
    return handleError(async () => {
      return await this.update(
        { user_id: user?.user_id },
        { is_verified: true }
      );
    });
  }
}
