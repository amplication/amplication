import { Injectable } from '@nestjs/common';
import { Webhooks } from '@octokit/webhooks';
import { CreateRepositoryPushRequest } from './entities/dto/CreateRepositoryPushRequest';
import { EnumProvider } from './entities/enums/provider';
import { QueueService } from './queue.service';

@Injectable()
export class AppService {
  constructor(
    private readonly queueService: QueueService,
    private webhooks: Webhooks,
  ) {
    webhooks = new Webhooks({
      secret: '3d751fb7-816d-40a0-87f4-4bd8781c3ed9',
    });
  }

  async verifyAndReceive(
    id: string,
    eventName: any,
    body: string,
    signature: string,
  ) {
    const res = await this.webhooks
      .verifyAndReceive({
        id: id,
        name: eventName,
        payload: body,
        signature: signature,
      })
      .catch(console.error);
    console.log(res);

    const pushRequest = this.createPushRequestObject(body);
    this.queueService.createPushRequest(pushRequest);
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
