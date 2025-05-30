import { Transform } from "class-transformer";
import { IsJWT, IsNotEmpty, IsUUID } from "class-validator";

export class VerifyEmailRequestDto {
  @IsJWT()
  @IsNotEmpty()
  token!: string;

  @Transform((e) => e.value.trim().toLocaleLowerCase())
  @IsUUID()
  @IsNotEmpty()
  user_id!: string;
}
