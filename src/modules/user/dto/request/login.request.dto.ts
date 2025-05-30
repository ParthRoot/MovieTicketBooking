import { IsString, IsNotEmpty } from "class-validator";
import { messages } from "../../../../core/utils";

export class LoginRequestDto {
  @IsString({ message: messages.invalidPassword })
  @IsNotEmpty({ message: messages.notEmptyPassword })
  password!: string;
}
