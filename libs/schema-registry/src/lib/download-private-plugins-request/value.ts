import { EnumGitProvider, GitProviderProperties } from "@amplication/util/git";
import {
  IsEnum,
  IsOptional,
  IsString,
  ValidateNested,
  IsArray,
} from "class-validator";

export class Value {
  @IsString()
  resourceId!: string;
  @IsString()
  buildId!: string;
  @IsEnum(EnumGitProvider)
  gitProvider!: EnumGitProvider;
  @ValidateNested()
  gitProviderProperties!: GitProviderProperties;
  @IsString()
  gitOrganizationName!: string;
  @IsString()
  gitRepositoryName!: string;
  @IsArray()
  pluginIds!: string[];
  @IsString()
  @IsOptional()
  repositoryGroupName?: string;
  @IsString()
  @IsOptional()
  baseBranchName?: string;
}
