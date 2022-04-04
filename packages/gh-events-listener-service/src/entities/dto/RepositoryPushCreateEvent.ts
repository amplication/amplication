import { EnumProvider } from '../enums/provider';

export class RepositoryPushCreateEvent {
  constructor(
    public readonly provider: EnumProvider,
    public readonly owner: string,
    public readonly repositoryName: string,
    public readonly branchName: string,
    public readonly commit: string,
    public readonly pushAt: Date,
    public readonly installationId: string,
  ) {}

  toString() {
    return JSON.stringify({
      provider: this.provider,
      owner: this.owner,
      repositoryName: this.repositoryName,
      branchName: this.branchName,
      commit: this.commit,
      pushAt: this.pushAt,
      installationId: this.installationId,
    });
  }
}
