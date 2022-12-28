import { IsOptional, IsString } from "class-validator";

export class CreateGitCommit {
  @IsString()
  @IsOptional()
  base?: string | undefined;
  @IsString()
  head!: string;
  @IsString()
  title!: string;
  @IsString()
  body!: string;
}
