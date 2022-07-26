import { IsOptional, IsString } from 'class-validator';

export class GitCommit {
  @IsString()
  @IsOptional()
  base?: string;
  @IsString()
  head!: string;
  @IsString()
  title!: string;
  @IsString()
  body!: string;
}
