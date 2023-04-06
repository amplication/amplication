import {
  EnumGitProvider,
  EnumPullRequestMode,
  GitResourceMeta,
} from "@amplication/git-utils";
import { IsOptional, IsString, ValidateNested } from "class-validator";

class Commit {
  @IsString()
  title!: string;
  @IsString()
  body!: string;
}

export class Value {
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
  @IsString()
  @IsOptional()
  gitRepositoryGroupName?: string;
  @ValidateNested()
  commit!: Commit;
  @ValidateNested()
  gitResourceMeta!: GitResourceMeta;
  @IsString()
  pullRequestMode!: EnumPullRequestMode;
}
