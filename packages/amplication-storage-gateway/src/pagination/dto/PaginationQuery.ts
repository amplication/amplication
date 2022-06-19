import { IsNumberString, IsOptional } from "class-validator";

export class PaginationQuery {
  @IsOptional()
  @IsNumberString()
  per_page?: number;

  @IsOptional()
  @IsNumberString()
  page?: number;
}
