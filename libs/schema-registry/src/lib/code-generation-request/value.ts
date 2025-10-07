import { IsString } from "class-validator";

export class Value {
  @IsString()
  buildId!: string;
  @IsString()
  resourceId!: string;
}
