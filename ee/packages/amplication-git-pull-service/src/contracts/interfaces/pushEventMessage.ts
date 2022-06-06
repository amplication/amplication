import { EventData } from './eventData';
import { GitProviderEnum } from '../enums/gitProvider.enum';
import { EnumGitPullEventStatus } from '../enums/gitPullEventStatus.enum';

export class PushEventMessage extends EventData {
  installationId: string;
  constructor(
    id: bigint,
    provider: keyof typeof GitProviderEnum,
    repositoryOwner: string,
    repositoryName: string,
    branch: string,
    commit: string,
    status: keyof typeof EnumGitPullEventStatus,
    pushedAt: Date,
    installationId: string
  ) {
    super(
      id,
      provider,
      repositoryOwner,
      repositoryName,
      branch,
      commit,
      status,
      pushedAt
    );

    this.installationId = installationId;
  }
}
