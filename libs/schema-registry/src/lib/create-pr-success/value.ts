import { IsString, IsUrl, IsOptional } from "class-validator";

export class Value {
  @IsString()
  buildId!: string;

  @IsUrl()
  @IsOptional()
  url?: string;
}
