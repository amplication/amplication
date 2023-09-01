import { IsInstance, IsString } from "class-validator";

export class Value {
  @IsString()
  buildId!: string;

  @IsString()
  codeGeneratorVersion!: string;

  @IsInstance(Error)
  error!: Error;
}
