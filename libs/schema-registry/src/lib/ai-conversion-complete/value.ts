import { IsBoolean, IsString } from "class-validator";

export class Value {
  @IsString()
  userActionId!: string;

  @IsBoolean()
  success!: boolean;

  @IsString()
  result?: string;

  @IsString()
  errorMessage?: string;
}
