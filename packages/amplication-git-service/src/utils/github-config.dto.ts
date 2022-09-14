import { Injectable } from '@nestjs/common';

@Injectable()
export class GithubConfig {
  constructor(public appId: string, public pem: string) {}
}
