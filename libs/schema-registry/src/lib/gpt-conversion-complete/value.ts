import { IsBoolean, IsString } from "class-validator";

export class Value {
  @IsBoolean()
  isGptConversionCompleted!: boolean;

  @IsString()
  result?: string;

  @IsString()
  errorMessage?: string;

  @IsString()
  requestUniqueId!: string;
}
