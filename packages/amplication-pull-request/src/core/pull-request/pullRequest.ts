import { EnumGitProvider } from '@amplication/common';
import { ChangedFile } from '@amplication/common/src/dto/ChangedFile';

export class PullRequest {
  url = '';
  constructor(
    public readonly gitProvider: EnumGitProvider,
    public readonly files: ChangedFile[]
  ) {
    // this.create();
  }
  /**
   * This method is creating the pr in the designated git provider
   */
  private create(): void {
    throw new Error('Method not implemented.');

    this.url = 'The resolte from the git provider';
  }
}
