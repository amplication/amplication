import { NestFactory } from '@nestjs/core';
import { Webhooks } from '@octokit/webhooks';
import { QueueModule } from './queue.module';
import { CreateRepositoryPushRequest } from './entities/dto/CreateRepositoryPushRequest';
import { EnumProvider } from './entities/enums/provider';
import { QueueService } from './queue.service';
import eventsource from 'eventsource';

async function bootstrap() {
  const app = await NestFactory.create(QueueModule);
  await app.listen(3001);
}

async function webhookBoot() {
  const webhooks = new Webhooks({
    secret: 'f52f279d-8d55-446e-a5ba-5b07bf4218f7',
  });
  const EventSource = eventsource;

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
    const resObj = createPushRequestObject(webhookEvent.body);
    console.log(resObj);
    //queueService.createPushRequest(createPushRequestObject(webhookEvent.body));
  };
}

function createPushRequestObject(body: any): CreateRepositoryPushRequest {
  const req: CreateRepositoryPushRequest = {
    provider: EnumProvider.Github,
    owner: body['owner'],
    repositoryName: body['repositoryName'],
    branchName: body['branchName'],
    commit: body['commit'],
    pushAt: new Date(),
    installationId: body['installationId'],
  };
  return req;
}

bootstrap();
