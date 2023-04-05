import { IsString, IsUrl } from "class-validator";

export class Value {
  @IsString()
  buildId!: string;

  @IsUrl()
  url?: string;
}
