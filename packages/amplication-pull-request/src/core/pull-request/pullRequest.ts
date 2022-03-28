import { Field, ObjectType } from '@nestjs/graphql';
import { EnumGitProvider } from 'src/models';
import { ChangedFile } from '../diff/dto/ChangedFile';

@ObjectType({ isAbstract: false })
export class PullRequest {
  constructor(gitProvider: EnumGitProvider) {
    this.gitProvider = gitProvider;
    // this.create();
  }
  /**
   * This method is creating the pr in the designated git provider
   */
  private create(): void {
    throw new Error('Method not implemented.');
  }
  @Field(() => EnumGitProvider)
  gitProvider!: EnumGitProvider;

  // @Field((of) => String)
  // url!: string;

  // @Field((of) => [ChangedFile])
  // changedFile!: ChangedFile[];
}
