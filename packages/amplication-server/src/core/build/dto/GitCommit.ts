import { IsOptional, IsString } from "class-validator";

export class GitCommit {
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
