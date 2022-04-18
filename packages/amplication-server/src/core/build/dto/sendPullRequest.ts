import { IsString, ValidateNested } from 'class-validator';
import { EnumGitProvider } from 'src/core/git/dto/enums/EnumGitProvider';
import { GitCommit } from './GitCommit';
export class SendPullRequestArgs {
  @IsString()
  amplicationAppId!: string;
  @IsString()
  oldBuildId!: string;
  @IsString()
  newBuildId!: string;
  @IsString()
  installationId!: string;
  @IsString()
  gitProvider!: EnumGitProvider;
  @IsString()
  gitOrganizationName!: string;
  @IsString()
  gitRepositoryName!: string;
  @ValidateNested()
  commit: GitCommit;
}
