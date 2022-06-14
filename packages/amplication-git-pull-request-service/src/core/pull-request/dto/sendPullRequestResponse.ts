import { IsUrl } from 'class-validator';
export class SendPullRequestResponse {
  @IsUrl()
  url!: string;
}
