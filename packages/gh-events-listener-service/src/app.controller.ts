import { Controller, Post, Headers, Body } from '@nestjs/common';
import { AppService } from './app.service';
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}
  @Post('/github')
  async createWebhooksMessage(
    @Headers() headers: Headers,
    @Body() payload: string,
  ) {
    await this.appService.createMessage(
      headers['x-github-delivery'],
      headers['x-github-event'],
      payload,
      headers['x-hub-signature-256'],
    );
  }
}
