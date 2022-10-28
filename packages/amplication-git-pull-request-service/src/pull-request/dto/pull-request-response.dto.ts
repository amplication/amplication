import { IsUrl } from 'class-validator';
export class PullRequestResponse {
  @IsUrl()
  url!: string;
}
