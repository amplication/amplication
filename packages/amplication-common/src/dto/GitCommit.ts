import { IsString } from "class-validator";

export class GitCommit {
  @IsString()
  base!: string;
  @IsString()
  head!: string;
  @IsString()
  title!: string;
  @IsString()
  body!: string;
}
