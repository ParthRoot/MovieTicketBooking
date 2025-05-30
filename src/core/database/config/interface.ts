import { JwtPayload } from "@core/utils";
import { AvailableRoleEnum } from "./enum";

export interface IUserPayload extends JwtPayload {
  userId: string;
  email: string;
  role: AvailableRoleEnum;
}

export interface IForgotPassword {
  user_id: string;
  email: string;
}
