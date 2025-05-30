import { IForgotPassword } from "@core/database/config/interface";

export class ForgotPasswordResponseDto {
  user_id: string;

  email: string;

  constructor(data: IForgotPassword) {
    this.user_id = data.user_id;
    this.email = data.email;
  }
}
