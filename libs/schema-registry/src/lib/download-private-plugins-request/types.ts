import {
  IsArray,
  IsEnum,
  IsOptional,
  IsString,
  ValidateNested,
} from "class-validator";
import { EnumGitProvider, GitProviderProperties } from "@amplication/util/git";

export class PluginDownloadItem {
  @IsString()
  pluginId!: string;
  @IsString()
  @IsOptional()
  pluginVersion?: string;
}

export class RepositoryPlugins {
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

  @IsArray()
  pluginsToDownload!: PluginDownloadItem[];
}
