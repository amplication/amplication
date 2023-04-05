import { IsString } from "class-validator";
import { isError } from "lodash";

export class Value {
  @IsString()
  buildId!: string;
  error!: Error;
}
