import { User } from "@core/database";

export class SignUpResponseDto {
  first_name: string;

  last_name: string;

  avatar: string;

  email: string;

  mobile_no: string;

  is_active: boolean;

  is_verified: boolean;

  role: string;

  constructor(user: User) {
    this.first_name = user?.first_name;
    this.last_name = user?.last_name;
    this.avatar = user?.avatar;
    this.email = user?.email;
    this.mobile_no = user?.phone;
    this.is_active = user?.is_active;
    this.is_verified = user?.is_verified;
    this.role = user?.role?.role_name;
  }
}
