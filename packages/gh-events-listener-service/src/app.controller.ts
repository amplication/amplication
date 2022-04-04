import { Body, Controller, Get, Post } from '@nestjs/common';
import { QueueService } from './queue.service';
import { Webhooks } from '@octokit/webhooks';
import { CreateRepositoryPushRequest } from './entities/dto/CreateRepositoryPushRequest';

@Controller()
export class AppController {
  constructor(private readonly queueService: QueueService) {}

  @Post('Push')
  createRepositoryPush(
    @Body() createRepositoryPushRequest: CreateRepositoryPushRequest,
  ) {
    this.queueService.createPushRequest(createRepositoryPushRequest);
  }
}

// async function webhookBoot() {
//   const webhooks = new Webhooks({
//     secret: 'f52f279d-8d55-446e-a5ba-5b07bf4218f7',
//   });
//   // eslint-disable-next-line @typescript-eslint/no-var-requires
//   const EventSource = require('eventsource');

//   const webhookProxyUrl = 'https://smee.io/5Dp9sYKOx0TxtiOR';
//   const source = new EventSource(webhookProxyUrl);
//   source.onmessage = (event) => {
//     const webhookEvent = JSON.parse(event.data);
//     webhooks
//       .verifyAndReceive({
//         id: webhookEvent['x-request-id'],
//         name: webhookEvent['x-github-event'],
//         signature: webhookEvent['x-hub-signature'],
//         payload: webhookEvent.body,
//       })
//       .catch(console.error);
//     console.log(webhookEvent.body);
//   };
//
