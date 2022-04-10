import { Controller, Post, Headers, Body } from '@nestjs/common';
import { Webhooks } from '@octokit/webhooks';
import { AppService } from './app.service';
@Controller()
export class AppController {
  webhooks = new Webhooks({
    secret: '3d751fb7-816d-40a0-87f4-4bd8781c3ed9',
  });
  constructor(private readonly appService: AppService) {}
  @Post('/payload')
  async createRepositoryPush(
    @Headers() headers: Headers,
    @Body() body: string,
  ) {
    await this.appService.verifyAndReceive(
      headers['x-github-delivery'],
      headers['x-github-event'],
      body,
      headers['x-hub-signature-256'],
    );
  }
}
