import { Type } from "class-transformer";
import { IsInt, IsOptional, IsPositive } from "class-validator";

export class PaginationReqDto {
  @Type(() => Number)
  @IsPositive()
  @IsInt()
  @IsOptional()
  readonly current_page!: number;

  @Type(() => Number)
  @IsPositive()
  @IsInt()
  @IsOptional()
  readonly record_per_page!: number;
}
