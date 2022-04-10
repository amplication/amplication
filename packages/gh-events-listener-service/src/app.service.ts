import { Injectable } from '@nestjs/common';
import { EmitterWebhookEventName, Webhooks } from '@octokit/webhooks';
import { CreateRepositoryPushRequest } from './entities/dto/CreateRepositoryPushRequest';
import { EnumProvider } from './entities/enums/provider';
import { QueueService } from './queue.service';
import { ConfigService } from '@nestjs/config';

const WEBHOOKS_SECRET_KEY = 'WEBHOOKS_SECRET_KEY';

@Injectable()
export class AppService {
  private webhooks: Webhooks;
  constructor(
    private readonly queueService: QueueService,
    configService: ConfigService,
  ) {
    this.webhooks = new Webhooks({
      secret: configService.get<string>(WEBHOOKS_SECRET_KEY),
    });
  }

  async verifyAndReceive(
    id: string,
    eventName: EmitterWebhookEventName,
    body: any,
    signature: string,
  ) {
    if (eventName.toString().toLowerCase() === 'push') {
      const currentBranch = await this.getBranchName(body.ref);
      const masterBranch = body.repository.master_branch;
      if (this.isMasterBranch(currentBranch, masterBranch)) {
        try {
          await this.webhooks.verifyAndReceive({
            id: id,
            name: eventName,
            payload: body,
            signature: signature,
          });
        } catch (error) {
          console.log(console.error); //todo: write more informative info
          return;
        }

        const pushRequest = await this.createPushRequestObject(body);
        await this.queueService.createPushRequest(pushRequest);
      }
    }
  }

  async getBranchName(fullName: string): Promise<string> {
    const splitName = fullName.split('/');
    return await splitName[2];
  }

  isMasterBranch(currentBranch: string, masterBranch: string): boolean {
    return currentBranch === masterBranch;
  }

  async createPushRequestObject(
    body: any,
  ): Promise<CreateRepositoryPushRequest> {
    const req: CreateRepositoryPushRequest = {
      provider: EnumProvider.Github,
      owner: body.repository.owner.login,
      repositoryName: body.repository.name,
      branchName: await this.getBranchName(body.ref),
      commit: body.head_commit.id,
      pushAt: new Date(body.repository.pushed_at * 1000),
      installationId: body.installation.id,
    };
    return req;
  }
}
