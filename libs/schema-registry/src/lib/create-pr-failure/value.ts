import { IsOptional, IsString } from "class-validator";

export class Value {
  @IsString()
  buildId!: string;

  @IsString()
  @IsOptional()
  errorMessage?: string;
}
