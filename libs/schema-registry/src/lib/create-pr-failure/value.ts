import { EnumGitProvider } from "@amplication/git-utils";
import { IsEnum, IsOptional, IsString } from "class-validator";

export class Value {
  @IsString()
  buildId!: string;

  @IsEnum(EnumGitProvider)
  gitProvider!: EnumGitProvider;

  @IsString()
  @IsOptional()
  errorMessage?: string;
}
