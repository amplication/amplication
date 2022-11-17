import { IsString, IsUrl } from "class-validator";
export class PullRequestResponse {
  @IsUrl()
  url?: string;

  @IsString()
  errorMessage?: string;
}
