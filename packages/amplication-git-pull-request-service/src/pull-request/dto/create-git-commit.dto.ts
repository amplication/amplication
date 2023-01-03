import { IsOptional, IsString } from "class-validator";

export class CreateGitCommit {
  @IsString()
  @IsOptional()
  base?: string | undefined;
  @IsOptional()
  @IsString()
  head?: string | undefined;
  @IsString()
  title!: string;
  @IsString()
  body!: string;
}
