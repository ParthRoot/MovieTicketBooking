import { User } from "@core/database";

export class LoginResponseDto {
  email: string;
  token: string;
  refresh_token: string;
  role_id: string;
  role_name: string;
  user_id: string;
  first_name: string;
  last_name: string;

  constructor(user: User, token: string, refresh_token: string) {
    this.email = user?.email;
    this.first_name = user?.first_name;
    this.last_name = user?.last_name;
    this.token = token;
    this.refresh_token = refresh_token;
    this.role_id = user?.role?.role_id;
    this.role_name = user?.role?.role_name;
    this.user_id = user?.user_id;
  }
}
