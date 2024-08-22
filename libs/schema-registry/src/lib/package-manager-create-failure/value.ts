import { IsString } from "class-validator";

export class Value {
  @IsString()
  resourceId!: string;

  @IsString()
  buildId!: string;

  @IsString()
  errorMessage!: string;
}
