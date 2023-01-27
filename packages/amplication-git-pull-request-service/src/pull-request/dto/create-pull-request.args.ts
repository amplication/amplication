import {
  EnumPullRequestMode,
  GitResourceMeta,
  Commit,
} from "@amplication/git-utils";
import { IsOptional, IsString, ValidateNested } from "class-validator";
import { EnumGitProvider } from "../../models";

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
  commit: Commit;
  @ValidateNested()
  gitResourceMeta: GitResourceMeta;
  @IsString()
  pullRequestMode: EnumPullRequestMode;
}
