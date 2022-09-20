import { IsString, IsUrl } from 'class-validator';
export class SendPullRequestResponse {
  @IsString()
  buildId!: string;
  
  @IsUrl()
  url?: string;

  @IsString()
  errorMessage?: string;
}
