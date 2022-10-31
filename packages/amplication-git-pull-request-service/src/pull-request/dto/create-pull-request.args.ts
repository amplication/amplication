import { IsOptional, IsString, ValidateNested } from 'class-validator';
import { EnumGitProvider } from '../../models';
import { CreateGitCommit } from './create-git-commit.dto';
import { GitResourceMeta } from './git-resource-meta.dto';

export class CreatePullRequestArgs {
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
  commit: CreateGitCommit;

  @ValidateNested()
  gitResourceMeta: GitResourceMeta;
}
