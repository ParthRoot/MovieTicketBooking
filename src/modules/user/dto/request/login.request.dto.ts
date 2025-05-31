import { IsString, IsNotEmpty, Matches } from "class-validator";
import { messages } from "../../../../core/utils";
import { Transform } from "class-transformer";
import { EMAIL_REGEX } from "@core/database/config/constant";

export class LoginRequestDto {
  @Matches(EMAIL_REGEX, {
    message: messages.validEmail,
  })
  @Transform((e) => e.value.trim().toLocaleLowerCase())
  @IsNotEmpty({ message: messages.notEmptyEmail })
  email!: string;

  @IsString({ message: messages.invalidPassword })
  @IsNotEmpty({ message: messages.notEmptyPassword })
  password!: string;
}
