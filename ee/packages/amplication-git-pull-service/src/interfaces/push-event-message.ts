import { EventData } from "./event-data";
import { GitProviderEnum, EnumGitPullEventStatus } from "../enums";

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
