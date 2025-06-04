import {
  IsMobilePhone,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  Matches,
  MaxLength,
} from "class-validator";
import { Transform } from "class-transformer";
import { messages } from "@core/utils";
import { EMAIL_REGEX } from "@core/database/config/constant";

export class SignUpRequestDto {
  @IsNotEmpty()
  @IsString()
  first_name!: string;

  @IsString()
  @IsNotEmpty()
  last_name!: string;

  @Matches(EMAIL_REGEX, {
    message: messages.validEmail,
  })
  @Transform((e) => e.value.trim().toLocaleLowerCase())
  @IsNotEmpty({ message: messages.notEmptyEmail })
  email!: string;

  @IsString({ message: messages.invalidPassword })
  @IsNotEmpty({ message: messages.notEmptyPassword })
  password!: string;

  @Transform((e) => e.value.trim().toLocaleLowerCase())
  @IsUUID()
  @IsNotEmpty()
  role_id!: string;

  @IsNotEmpty()
  @IsString()
  @IsMobilePhone()
  @MaxLength(10)
  mobile_no!: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  avatar!: string;
}
