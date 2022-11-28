import { EnumProvider } from '../../git-organization/git-organization.types';

export class CreateEventRepositoryPush {
  constructor(
    public readonly provider: EnumProvider,
    public readonly repositoryOwner: string,
    public readonly repositoryName: string,
    public readonly branch: string,
    public readonly commit: string,
    public readonly pushedAt: Date,
    public readonly installationId: string,
  ) {}

  toString() {
    return JSON.stringify({
      provider: this.provider,
      repositoryOwner: this.repositoryOwner,
      repositoryName: this.repositoryName,
      branch: this.branch,
      commit: this.commit,
      pushedAt: this.pushedAt,
      installationId: this.installationId,
    });
  }
}
