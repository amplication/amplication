import { IsString } from "class-validator";

export class Value {
  @IsString()
  buildId!: string;

  errorMessage?: string;
}
