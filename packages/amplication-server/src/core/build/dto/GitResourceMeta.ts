import { IsString } from "class-validator";

export class GitResourceMeta {
  @IsString()
  serverPath: string;
  @IsString()
  adminUIPath: string;
}
