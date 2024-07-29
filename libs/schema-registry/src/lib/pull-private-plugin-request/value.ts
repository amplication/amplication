import { EnumGitProvider, GitProviderProperties } from "@amplication/util/git";
import { IsEnum, IsOptional, IsString, ValidateNested } from "class-validator";

export class Value {
  @IsString()
  resourceId!: string;
  @IsString()
  resourceName!: string;
  @IsEnum(EnumGitProvider)
  gitProvider!: EnumGitProvider;
  @ValidateNested()
  gitProviderProperties!: GitProviderProperties;
  @IsString()
  gitOrganizationName!: string;
  @IsString()
  gitRepositoryName!: string;
  @IsString()
  @IsOptional()
  repositoryGroupName?: string;
  @IsString()
  @IsOptional()
  baseBranchName?: string;
}
