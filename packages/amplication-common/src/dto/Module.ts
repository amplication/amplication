import { IsString } from "class-validator";

export class Module {
  @IsString()
  path!: string;
  @IsString()
  code!: string;
}
