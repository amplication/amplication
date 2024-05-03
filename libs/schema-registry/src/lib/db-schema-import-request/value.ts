import { IsString } from "class-validator";

export class Value {
  @IsString()
  actionId!: string;

  @IsString()
  file!: string;
}
