import { EnumGitProvider } from "@amplication/git-utils";
import { IsString, IsUrl, IsOptional, IsEnum } from "class-validator";

export class Value {
  @IsString()
  buildId!: string;

  @IsEnum(EnumGitProvider)
  gitProvider!: EnumGitProvider;

  @IsUrl()
  @IsOptional()
  url?: string;
}
