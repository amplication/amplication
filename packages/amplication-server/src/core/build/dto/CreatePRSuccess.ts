import { IsString, IsUrl } from "class-validator";
export class CreatePRSuccess {
  @IsString()
  buildId!: string;

  @IsUrl()
  url?: string;
}
