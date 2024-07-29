import { IsString } from "class-validator";

export class Value {
  @IsString()
  pluginPath!: string;
}
