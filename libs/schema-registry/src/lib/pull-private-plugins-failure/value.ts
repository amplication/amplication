import { IsString } from "class-validator";

export class Value {
  @IsString()
  errorMessage!: string;

  @IsString()
  buildId!: string;
}
