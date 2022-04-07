import { Controller, Post, Req, Request } from '@nestjs/common';
import { Webhooks } from '@octokit/webhooks';
import { AppService } from './app.service';

@Controller()
export class AppController {
  webhooks = new Webhooks({
    secret: '3d751fb7-816d-40a0-87f4-4bd8781c3ed9',
  });
  constructor(private readonly appService: AppService) {}
  @Post('/payload')
  async createRepositoryPush(@Req() request: Request) {
    let resBody: string = null;
    fetch(request)
      .then((response) => response.body)
      .then(async (body) => {
        const reader = body.getReader();
        const res = await reader.read();
        resBody = res.value.toString();
        console.log(res.value.toString());
      });
    const res = await this.webhooks
      .verifyAndReceive({
        id: request.headers['x-github-delivery'],
        name: request.headers['x-github-event'],
        payload: 'request.bod',
        signature: request.headers['x-hub-signature-256'],
      })
      .catch(console.error);
    console.log(res);

    this.appService.verifyAndReceive(
      request.headers['x-github-delivery'],
      request.headers['x-github-event'],
      resBody,
      request.headers['x-hub-signature-256'],
    );
  }
}
