import { IsString } from "class-validator";
export class CreatePRFailure {
  @IsString()
  buildId!: string;

  @IsString()
  errorMessage?: string;
}
