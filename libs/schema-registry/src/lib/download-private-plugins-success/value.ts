import { IsString } from "class-validator";

export class Value {
  @IsString()
  pluginPaths!: string[];

  @IsString()
  buildId!: string;
}
