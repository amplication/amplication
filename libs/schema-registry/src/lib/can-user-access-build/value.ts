import { IsString } from "class-validator";

export class Value {
  @IsString()
  userId!: string;
  @IsString()
  buildId!: string;
}
