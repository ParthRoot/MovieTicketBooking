import { Matches, IsNotEmpty } from "class-validator";
import { EMAIL_REGEX } from "../../../../core/database/config/constant";
import { messages } from "../../../../core/utils";
import { Transform } from "class-transformer";

export class ForgotPasswordRequestDto {
  @Matches(EMAIL_REGEX, {
    message: messages.validEmail,
  })
  @Transform((e) => e.value.trim().toLocaleLowerCase())
  @IsNotEmpty({ message: messages.notEmptyEmail })
  email!: string;
}
