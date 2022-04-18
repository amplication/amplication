import { Injectable } from '@nestjs/common';
import { EmitterWebhookEventName, Webhooks } from '@octokit/webhooks';
import { CreateRepositoryPushRequest } from '../entities/dto/CreateRepositoryPushRequest';
import { EnumProvider } from '../entities/enums/provider';
import { QueueService } from '../queue.service';
import { ConfigService } from '@nestjs/config';
import { GitOrganizationRepository } from '../repositories/gitOrganization.repository';
import { PushEvent } from '@octokit/webhooks-types';
import { IApp } from '../contracts/IApp';

const WEBHOOKS_SECRET_KEY = 'WEBHOOKS_SECRET_KEY';

@Injectable()
export class AppService implements IApp {
  private webhooks: Webhooks;
  constructor(
    private readonly queueService: QueueService,
    configService: ConfigService,
    private readonly gitOrganizationRepository: GitOrganizationRepository,
  ) {
    this.webhooks = new Webhooks({
      secret: configService.get<string>(WEBHOOKS_SECRET_KEY),
    });
  }

  async createMessage(
    id: string,
    eventName: EmitterWebhookEventName,
    payload: string,
    signature: string,
    provider: EnumProvider,
  ) {
    switch (eventName.toString().toLowerCase()) {
      case 'push':
        await this.createPushMessage(
          id,
          eventName,
          payload,
          signature,
          provider,
        );
        break;
      default:
        return;
    }
  }

  async createPushMessage(
    id: string,
    eventName: EmitterWebhookEventName,
    payload: string,
    signature: string,
    provider: EnumProvider,
  ) {
    const pushEventObj: PushEvent = JSON.parse(JSON.stringify(payload));
    if (this.isMasterBranch(pushEventObj)) {
      if (await this.verifyAndReceive(id, eventName, payload, signature)) {
        const pushRequest = await this.createPushRequestObject(pushEventObj);
        if (!this.isInstallationIdExist(pushRequest.installationId, provider)) {
          console.log(
            `installationId: ${pushRequest.installationId} does not exist`,
          );
          return;
        }
        await this.queueService.createPushRequest(pushRequest);
      }
    } else {
      console.log(``); //convert to winston
    }
  }

  async isInstallationIdExist(
    installationId: string,
    provider: EnumProvider,
  ): Promise<boolean> {
    const gitInstallationId =
      await this.gitOrganizationRepository.getOrganizationByInstallationId(
        installationId,
        provider,
      );
    if (gitInstallationId) return true;
    else return false;
  }

  async verifyAndReceive(
    id: string,
    eventName: EmitterWebhookEventName,
    payload: string,
    signature: string,
  ): Promise<boolean> {
    try {
      await this.webhooks.verifyAndReceive({
        id: id,
        name: eventName,
        payload: payload,
        signature: signature,
      });
    } catch (error) {
      console.log(error); //todo: write more informative info// copy from the server winston logger
      return false;
    }
    return true;
  }

  getBranchName(fullName: string): string {
    const splitName = fullName.split('/');
    return splitName[2];
  }

  isMasterBranch(payload: PushEvent): boolean {
    const currentBranch = this.getBranchName(payload.ref);
    const masterBranch = payload.repository.master_branch;
    return currentBranch === masterBranch;
  }

  async createPushRequestObject(
    payload: PushEvent,
  ): Promise<CreateRepositoryPushRequest> {
    const req: CreateRepositoryPushRequest = {
      provider: EnumProvider.Github,
      repositoryOwner: payload.repository.owner.login,
      repositoryName: payload.repository.name,
      branch: await this.getBranchName(payload.ref),
      commit: payload.head_commit.id,
      pushedAt: new Date(
        this.intTryParse(payload.repository.pushed_at.toString()) * 1000,
      ),
      installationId: payload.installation.id.toString(),
    };
    return req;
  }

  private intTryParse(value: string): number {
    let res = 0;
    try {
      res = parseInt(value);
    } catch (error) {}
    return res;
  }
}
