import { EnumGitProvider } from '@amplication/git-service';
import { IsOptional, IsString, ValidateNested } from 'class-validator';
import { GitCommit } from './GitCommit';
import { GitResourceMeta } from './GitResourceMeta';
export class SendPullRequestArgs {
  @IsString()
  resourceId!: string;

  @IsString()
  @IsOptional()
  oldBuildId?: string | undefined;

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

  @ValidateNested()
  gitResourceMeta: GitResourceMeta;
}
