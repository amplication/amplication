import { EnumGitProvider } from 'src/models';
import { ChangedFile } from '../diff/dto/ChangedFile';

export class PullRequest {
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
  }

  // @Field((of) => String)
  // url!: string;

  // @Field((of) => [ChangedFile])
  // changedFile!: ChangedFile[];
}
