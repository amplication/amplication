import { EnumGitProvider } from "@amplication/util/git";
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
