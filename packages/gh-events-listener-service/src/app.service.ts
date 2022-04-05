import { Injectable } from '@nestjs/common';
import { Webhooks } from '@octokit/webhooks';
import { CreateRepositoryPushRequest } from './entities/dto/CreateRepositoryPushRequest';
import { EnumProvider } from './entities/enums/provider';
import { QueueService } from './queue.service';

@Injectable()
export class AppService {
  constructor(private readonly queueService: QueueService) {
    this.webhookBoot();
  }

  webhookBoot() {
    const webhooks = new Webhooks({
      secret: 'f52f279d-8d55-446e-a5ba-5b07bf4218f7',
    });
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const EventSource = require('eventsource');
    const webhookProxyUrl = 'https://smee.io/5Dp9sYKOx0TxtiOR';
    const source = new EventSource(webhookProxyUrl);
    source.onmessage = (event) => {
      const webhookEvent = JSON.parse(event.data);
      webhooks
        .verifyAndReceive({
          id: webhookEvent['x-request-id'],
          name: webhookEvent['x-github-event'],
          signature: webhookEvent['x-hub-signature'],
          payload: webhookEvent.body,
        })
        .catch(console.error);
      console.log(webhookEvent.body);
      const resObj = this.createPushRequestObject(webhookEvent.body);
      console.log(resObj);
      this.queueService.createPushRequest(resObj);
    };
  }

  createPushRequestObject(body: any): CreateRepositoryPushRequest {
    const req: CreateRepositoryPushRequest = {
      provider: EnumProvider.Github,
      owner: body.repository.owner.login,
      repositoryName: body.repository.name,
      branchName: body.check_suite.head_branch,
      commit: body.head_commit.message,
      pushAt: new Date(),
      installationId: body.installation.id,
    };
    return req;
  }
}
