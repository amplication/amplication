import { IsNumberString, IsOptional } from "class-validator";

export class PaginationQuery {
  @IsOptional()
  @IsNumberString()
  // eslint-disable-next-line @typescript-eslint/naming-convention
  per_page?: number;

  @IsOptional()
  @IsNumberString()
  page?: number;
}
